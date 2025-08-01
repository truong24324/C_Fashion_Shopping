package Backend.Service;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import Backend.Model.Order;
import Backend.Model.OrderStatus;
import Backend.Repository.OrderStatusRepository;
import Backend.Request.OrderRequest;
import Backend.Response.PaymentResponse;
import Backend.Util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VNPayService {

    @Value("${payment.vnPay.url}")
    private String vnp_PayUrl;

    @Value("${payment.vnPay.returnUrl}")
    private String vnp_ReturnUrl;

    @Value("${payment.vnPay.tmnCode}")
    private String vnp_TmnCode;

    @Value("${payment.vnPay.secretKey}")
    private String secretKey;

    private final OrderService orderService;
    private final OrderStatusRepository orderStatusRepository;

    public PaymentResponse createPaymentUrl(long price, String bankCode, HttpServletRequest request, OrderRequest orderRequestDto) {
        long amount = price * 100L;

        // Get base parameters
        Map<String, String> vnpParamsMap = VNPayUtil.getBaseParams(vnp_TmnCode);

        // Place the order and get the order object
        Order order = orderService.placeOrder(orderRequestDto);

        // Add necessary parameters
        vnpParamsMap.put("vnp_TxnRef", String.valueOf(order.getOrderId()));
        vnpParamsMap.put("vnp_OrderInfo", "Thanh toan don hang: " + order.getOrderId());
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        vnpParamsMap.put("vnp_ReturnUrl", vnp_ReturnUrl + "?orderId=" + order.getOrderId());
        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
        vnpParamsMap.put("vnp_ExpireDate", VNPayUtil.getExpireDate(0));

        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }

        // Build hash data and secure hash
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String secureHash = VNPayUtil.hmacSHA512(secretKey, hashData);

        // Build payment URL
        String paymentUrl = vnp_PayUrl + "?" + VNPayUtil.getPaymentURL(vnpParamsMap, true) + "&vnp_SecureHash=" + secureHash;

        return new PaymentResponse("00", paymentUrl);
    }

    public void handlePaymentReturn(HttpServletRequest request) {
        int orderId = Integer.parseInt(request.getParameter("orderId"));
        String responseCode = request.getParameter("vnp_ResponseCode");

        Order order = orderService.findById(orderId);

        if ("00".equals(responseCode)) {
            OrderStatus completed = orderStatusRepository.findByStatusName("Completed")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái 'Completed'"));
            order.setOrderStatus(completed);
            order.setPaymentStatus("Đã thanh toán");
        } else {
            OrderStatus failed = orderStatusRepository.findByStatusName("Failed")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái 'Failed'"));
            order.setOrderStatus(failed);
            order.setPaymentStatus("Chưa thanh toán");
        }

        order.setUpdatedAt(LocalDateTime.now());
        orderService.save(order);
    }
}
