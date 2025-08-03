package Backend.Domain.Product.DTO.Response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PurchasedProductResponse {
    private Integer orderDetailId;
    private Integer productId;
    private String productName;
    private String colorName;
    private String sizeName;
    private String materialName;
    private BigDecimal productPrice;
    private Integer quantity;
    private String mainImageUrl;
    private boolean reviewed;
}
