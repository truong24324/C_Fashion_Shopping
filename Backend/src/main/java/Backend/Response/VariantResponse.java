package Backend.Response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VariantResponse {
    private Integer variantId;
    private Integer productId;
    private String productName;
    private String colorName;
    private String sizeName;
    private String materialName;
    private Integer stock;
    private BigDecimal price;
}
