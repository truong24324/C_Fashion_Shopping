package Backend.Request;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OrderRequest {

    @NotNull(message = "Account ID không thể để trống")
    private Integer accountId;

    @NotNull(message = "Tên đầy đủ không thể để trống")
    private String fullName;

    @Email(message = "Email không hợp lệ")
    private String email;

    @Pattern(regexp = "^\\d{10}$", message = "Số điện thoại không hợp lệ, phải có 10 chữ số")
    private String phone;

    private String shippingAddress;

    @NotNull(message = "Tổng số tiền không thể để trống")
    @Positive(message = "Tổng số tiền phải lớn hơn 0")
    private BigDecimal totalAmount;

    private Integer orderStatusId;  // Mã trạng thái đơn hàng

    private String paymentMethod;   // Phương thức thanh toán

    private String paymentStatus;  // Trạng thái thanh toán (0: chưa thanh toán, 1: đã thanh toán)

    private String orderCode;  // Mã đơn hàng, có thể để trống nếu không cần thiết

    @NotEmpty(message = "Danh sách chi tiết đơn hàng không thể để trống")
    private OrderDetailRequest[] orderDetails;

    @Data
    public static class OrderDetailRequest {

        @NotNull(message = "ID biến thể không thể để trống")
        private Integer variantId;

        @NotNull(message = "Giá sản phẩm không thể để trống")
        @Positive(message = "Giá sản phẩm phải lớn hơn 0")
        private BigDecimal productPrice;

        @NotNull(message = "Số lượng không thể để trống")
        @Min(value = 1, message = "Số lượng phải lớn hơn 0")
        private Integer quantity;
    }

    private List<DiscountRequest> discount;

    @Positive(message = "Phí vận chuyển phải lớn hơn 0")
    private BigDecimal shippingFee;

//    // Kiểm tra tổng số tiền có khớp với giá trị của các sản phẩm trong đơn hàng
//    public void validateTotalAmount() {
//        BigDecimal calculatedTotal = BigDecimal.ZERO;
//
//        // Tính tổng tiền dựa trên chi tiết đơn hàng
//        for (OrderDetailRequest detail : orderDetails) {
//            calculatedTotal = calculatedTotal.add(detail.getProductPrice().multiply(new BigDecimal(detail.getQuantity())));
//        }
//
//        if (calculatedTotal.compareTo(totalAmount) != 0) {
//            throw new IllegalArgumentException("Tổng số tiền không khớp với tổng giá trị các sản phẩm trong đơn hàng");
//        }
//    }
}
