package Backend.Response;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class OrderDetailResponse {
	private Integer orderId;
	private String orderStatus;
    private String productName;
    private String colorName;
    private String sizeName;
    private String materialName;
    private BigDecimal productPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
    private String productImageUrl; // optional
}
