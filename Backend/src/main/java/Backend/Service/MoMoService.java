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

        // 2️⃣ Tạo đơn hàng ban đầu (chưa thanh toán)
        Order order = orderService.placeOrder(orderRequestDto);
        order.setAccount(account);
        order.setOrderDate(LocalDateTime.now());
        order.setIsActive(true);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setPaymentStatus(0); // Chưa thanh toán
        order.setPaymentMethod("MOMO");

        // Gán trạng thái mặc định là "Chờ thanh toán"
        OrderStatus pendingStatus = orderStatusRepository.findByStepOrder(0)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái 'Chờ thanh toán'"));
        order.setOrderStatus(pendingStatus);

        // 3️⃣ Áp dụng mã giảm giá (nếu có)
        BigDecimal adjustedPrice = orderRequestDto.getTotalAmount();
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

                BigDecimal shippingFee = orderRequestDto.getShippingFee() != null ? orderRequestDto.getShippingFee() : BigDecimal.ZERO;
                order.setShippingFee(shippingFee);

                // totalAmount = adjustedPrice (sau giảm giá) + phí vận chuyển
                BigDecimal totalAmount = adjustedPrice.add(shippingFee).add(shippingFee);
                order.setTotalAmount(totalAmount);

                // Kiểm tra đã dùng chưa
                List<Order> usedOrders = orderRepository
                        .findByAccountAccountIdAndDiscountCodeAndPaymentStatus(orderRequestDto.getAccountId(), discountCode, 1);
                if (!usedOrders.isEmpty()) {
                    throw new RuntimeException("Bạn đã sử dụng mã giảm giá này rồi");
                }

                // Áp dụng giảm giá
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

                // Cập nhật số lượng còn lại
                discount.setQuantity(discount.getQuantity() - 1);
                discountRepository.save(discount);

                // Lưu thông tin giảm giá vào đơn hàng
                order.setDiscountCode(discountCode);
                order.setDiscount(discount);

            }
        }

        // 4️⃣ Cập nhật tổng tiền
        order.setTotalAmount(adjustedPrice);

        // 5️⃣ Gán mã đơn hàng (MoMo yêu cầu)
        String orderId = "ORDER" + System.currentTimeMillis();
        order.setOrderCode(orderId);

        // 6️⃣ Lưu đơn hàng tạm thời
        orderRepository.save(order);

        // 7️⃣ Tạo yêu cầu thanh toán đến MoMo
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
        String payUrl = resJson.getString("payUrl");

        // 8️⃣ Trả về kết quả
        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setCode("00");
        paymentResponse.setPaymentUrl(payUrl);
        return paymentResponse;
    }
}
