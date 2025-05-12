package Backend.Service;

import java.math.BigDecimal;
import java.net.*;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Backend.Configuration.MomoUtil;
import Backend.Model.*;
import Backend.Repository.*;
import Backend.Request.OrderRequest;
import Backend.Request.DiscountRequest;
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
        order.setPaymentStatus("Thanh toán thất bại"); // Tránh lỗi nếu DB column chỉ có VARCHAR(10)
        order.setPaymentMethod("MOMO");

        // Gán trạng thái mặc định
        OrderStatus pendingStatus = orderStatusRepository.findByStepOrder(1)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái 'Chờ thanh toán'"));
        order.setOrderStatus(pendingStatus);

        // 3️⃣ Tổng tiền tạm tính từ request
        BigDecimal adjustedPrice = orderRequestDto.getTotalAmount();
        BigDecimal shippingFee = orderRequestDto.getShippingFee() != null ? orderRequestDto.getShippingFee() : BigDecimal.ZERO;
        order.setShippingFee(shippingFee);

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
                        .findByAccountAccountIdAndDiscountCodeAndPaymentStatus(orderRequestDto.getAccountId(), discountCode, "Đã thanh toán");
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
        adjustedPrice = adjustedPrice.add(shippingFee);
        order.setTotalAmount(adjustedPrice);

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

        String payUrl = resJson.getString("payUrl");

        // 9️⃣ Trả kết quả cho FE
        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setCode("00");
        paymentResponse.setPaymentUrl(payUrl);
        return paymentResponse;
    }


      
}
