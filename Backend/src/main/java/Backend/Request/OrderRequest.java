package Backend.Request;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {

    @NotNull(message = "Account ID cannot be null")
    private Integer accountId;

    @NotNull(message = "Full name cannot be null")
    private String fullName;

    private String email;
    private String phone;
    private String shippingAddress;

    @NotNull(message = "Total amount cannot be null")
    private BigDecimal totalAmount;

    private Integer orderStatusId;  // Mã trạng thái đơn hàng

    private String paymentMethod;   // Phương thức thanh toán
    private Integer paymentStatus;  // Trạng thái thanh toán (0: chưa thanh toán, 1: đã thanh toán)

    // Có thể bổ sung thêm các thuộc tính khác như các chi tiết sản phẩm trong đơn hàng
    private OrderDetailRequest[] orderDetails;

    @Data
    public static class OrderDetailRequest {

        @NotNull(message = "Product ID cannot be null")
        private Integer productId;

        @NotNull(message = "Variant ID cannot be null")
        private Integer variantId;

        @NotNull(message = "Product name cannot be null")
        private String productName;

        private String colorName;
        private String sizeName;
        private String materialName;

        @NotNull(message = "Product price cannot be null")
        private BigDecimal productPrice;

        @NotNull(message = "Quantity cannot be null")
        private Integer quantity;
    }
    
	private List<DiscountRequest> discount;
	private BigDecimal shippingFee;

}
