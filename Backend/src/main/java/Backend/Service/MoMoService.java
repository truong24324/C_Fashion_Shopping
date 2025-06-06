package Backend.Service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Backend.Configuration.MomoUtil;
import Backend.Model.Account;
import Backend.Model.Discount;
import Backend.Model.DiscountType;
import Backend.Model.Order;
import Backend.Model.OrderStatus;
import Backend.Repository.AccountRepository;
import Backend.Repository.DiscountRepository;
import Backend.Repository.OrderRepository;
import Backend.Repository.OrderStatusRepository;
import Backend.Request.DiscountRequest;
import Backend.Request.OrderRequest;
import Backend.Response.PaymentResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MoMoService {

    @Value("${payment.momo.partnerCode}")
    private String partnerCode;

    @Value("${payment.momo.accessKey}")
    private String accessKey;

    @Value("${payment.momo.secretKey}")
    private String secretKey;

    @Value("${payment.momo.returnUrl}")
    private String returnUrl;

    @Value("${payment.momo.ipnUrl}")
    private String ipnUrl;

    @Value("${payment.momo.endpoint}")
    private String momoEndpoint;

    @Value("${payment.momo.requestType}")
    private String requestType;

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final AccountRepository accountRepository;
    private final DiscountRepository discountRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final MomoUtil momoUtil;

    @Transactional
    public PaymentResponse createMomoPayment(OrderRequest orderRequestDto) throws Exception {
        // 1️⃣ Lấy tài khoản
        Account account = accountRepository.findById(orderRequestDto.getAccountId())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

        // 2️⃣ Tạo đơn hàng ban đầu
        Order order = orderService.placeOrder(orderRequestDto);
        order.setAccount(account);
        order.setOrderDate(LocalDateTime.now());
        order.setIsActive(true);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setPaymentMethod("MOMO");

        // Gán trạng thái mặc định
        OrderStatus pendingStatus = orderStatusRepository.findByStepOrder(1)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái 'Chờ thanh toán'"));
        order.setOrderStatus(pendingStatus);

        // 3️⃣ Tổng tiền tạm tính từ request
        BigDecimal adjustedPrice = orderRequestDto.getTotalAmount();
        // BigDecimal shippingFee = orderRequestDto.getShippingFee() != null ? orderRequestDto.getShippingFee()
        //         : BigDecimal.ZERO;
        // order.setShippingFee(shippingFee);

        // 4️⃣ Áp dụng giảm giá nếu có
        if (orderRequestDto.getDiscount() != null && !orderRequestDto.getDiscount().isEmpty()) {
            DiscountRequest discountDto = orderRequestDto.getDiscount().get(0);
            String discountCode = discountDto.getDiscountCode();

            if (discountCode != null && !discountCode.isEmpty()) {
                Optional<Discount> optionalDiscount = discountRepository.findByDiscountCode(discountCode);
                if (optionalDiscount.isEmpty()) {
                    throw new RuntimeException("Mã giảm giá không tồn tại!");
                }

                Discount discount = optionalDiscount.get();
                if (!Boolean.TRUE.equals(discount.getIsActive()) || discount.getQuantity() <= 0) {
                    throw new RuntimeException("Mã giảm giá không hợp lệ hoặc đã hết!");
                }

                LocalDateTime now = LocalDateTime.now();
                if (discount.getStartDate() != null && now.isBefore(discount.getStartDate())) {
                    throw new RuntimeException("Mã giảm giá chưa đến thời gian áp dụng!");
                }
                if (discount.getEndDate() != null && now.isAfter(discount.getEndDate())) {
                    throw new RuntimeException("Mã giảm giá đã hết hạn!");
                }

                // Kiểm tra đã dùng chưa
                List<Order> usedOrders = orderRepository
                        .findByAccountAccountIdAndDiscountCodeAndPaymentStatus(orderRequestDto.getAccountId(),
                                discountCode, "Đã thanh toán");
                if (!usedOrders.isEmpty()) {
                    throw new RuntimeException("Bạn đã sử dụng mã giảm giá này rồi");
                }

                // Tính toán giá sau giảm
                BigDecimal discountValue = BigDecimal.valueOf(discount.getDiscountValue());
                BigDecimal discountAmount = BigDecimal.ZERO;
                if (discount.getDiscountType() == DiscountType.PERCENT) {
                    discountAmount = adjustedPrice.multiply(discountValue).divide(BigDecimal.valueOf(100));
                    discountAmount = discountAmount.min(BigDecimal.valueOf(990000));
                } else if (discount.getDiscountType() == DiscountType.AMOUNT) {
                    discountAmount = discountValue;
                }
                discountAmount = discountAmount.min(adjustedPrice);
                adjustedPrice = adjustedPrice.subtract(discountAmount);

                // Giảm số lượng
                discount.setQuantity(discount.getQuantity() - 1);
                discountRepository.save(discount);

                order.setDiscountCode(discountCode);
                order.setDiscount(discount);
            }
        }

        // 5️⃣ Tổng cộng lại: giá sau giảm + phí ship
        // adjustedPrice = adjustedPrice.add(shippingFee);
        // order.setTotalAmount(adjustedPrice);

        // 6️⃣ Gán mã đơn hàng duy nhất
        String orderId = "ORDER-" + UUID.randomUUID();
        order.setOrderCode(orderId);

        // 7️⃣ Lưu đơn hàng tạm
        orderRepository.save(order);

        // 8️⃣ Gửi yêu cầu đến MoMo
        String requestId = UUID.randomUUID().toString();
        String orderInfo = "Thanh toán đơn hàng #" + order.getOrderId();

        String rawSignature = "accessKey=" + accessKey +
                "&amount=" + adjustedPrice +
                "&extraData=" +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + returnUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        String signature = momoUtil.generateSignature(rawSignature, secretKey);

        JSONObject body = new JSONObject();
        body.put("partnerCode", partnerCode);
        body.put("accessKey", accessKey);
        body.put("requestId", requestId);
        body.put("amount", String.valueOf(adjustedPrice));
        body.put("orderId", orderId);
        body.put("orderInfo", orderInfo);
        body.put("redirectUrl", returnUrl);
        body.put("ipnUrl", ipnUrl);
        body.put("extraData", "");
        body.put("requestType", requestType);
        body.put("signature", signature);
        body.put("lang", "vi");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(momoEndpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body.toString()))
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        JSONObject resJson = new JSONObject(response.body());
        System.out.println("MoMo response: " + resJson.toString());

        PaymentResponse paymentResponse = new PaymentResponse();

        if (resJson.getInt("resultCode") == 0) {
            // Nếu thành công, cập nhật trạng thái đơn hàng thành "Chờ xác nhận"
            OrderStatus waitingConfirmStatus = orderStatusRepository.findByStepOrder(1)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái 'Chờ xác nhận'"));

            order.setOrderStatus(waitingConfirmStatus);
            order.setPaymentStatus("Chưa thanh toán");
            orderRepository.save(order);
            paymentResponse.setCode("00");
            paymentResponse.setPaymentUrl(resJson.getString("payUrl"));
        } else {
            // Nếu thất bại, cập nhật trạng thái đơn hàng thành "Đã hủy"
            OrderStatus cancelledStatus = orderStatusRepository.findByStepOrder(-1)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái 'Đã hủy'"));

            order.setOrderStatus(cancelledStatus);
            order.setPaymentStatus("Thanh toán thất bại");
            orderRepository.save(order);

            throw new RuntimeException("MoMo thất bại: " + resJson.getString("message"));
        }

        return paymentResponse;
    }

    public String buildRawData(java.util.Map<String, String> params) {
        return "accessKey=" + accessKey
                + "&amount=" + params.get("amount")
                + "&extraData=" + params.get("extraData")
                + "&message=" + params.get("message")
                + "&orderId=" + params.get("orderId")
                + "&orderInfo=" + params.get("orderInfo")
                + "&orderType=" + params.get("orderType")
                + "&partnerCode=" + params.get("partnerCode")
                + "&payType=" + params.get("payType")
                + "&requestId=" + params.get("requestId")
                + "&responseTime=" + params.get("responseTime")
                + "&resultCode=" + params.get("resultCode")
                + "&transId=" + params.get("transId");
    }

    public String hmacSHA256(String data, String secretKey) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("HMAC SHA256 Error", e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

}
