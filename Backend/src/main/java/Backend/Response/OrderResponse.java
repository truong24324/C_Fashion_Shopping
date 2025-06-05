package Backend.Response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class OrderResponse {
    private Integer orderId;
    private String orderCode;
    private LocalDateTime orderDate;
    private String fullName;
    private String email;
    private String phone;
    private String shippingAddress;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private String orderStatus;
    private BigDecimal shippingFee;
    private LocalDateTime createdAt;
    private List<OrderDetailResponse> orderDetails;

    @Data
    public static class OrderDetailResponse {
        private Integer variantId;
        private String productName;
        private String colorName;
        private String sizeName;
        private String materialName;
        private BigDecimal productPrice;
        private Integer quantity;
        private BigDecimal totalPrice;
    }
}
