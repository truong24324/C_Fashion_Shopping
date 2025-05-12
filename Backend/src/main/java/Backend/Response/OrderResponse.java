package Backend.Response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderResponse {
    private Integer orderId;
    private String fullName;
    private String email;
    private String phone;
    private String shippingAddress;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String orderStatus;
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
