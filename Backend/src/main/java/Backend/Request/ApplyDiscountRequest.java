package Backend.Request;

import lombok.Data;

@Data
public class ApplyDiscountRequest {
    private String discountCode;
    private double subtotal;
    private double shippingFee; 
    private Integer accountId; // nếu cần kiểm tra theo người dùng
}
