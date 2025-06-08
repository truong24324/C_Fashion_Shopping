package Backend.Response;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class ProductSuggestResponse {
    private Integer productId;
    private String productName;
    private String image;
    private String imageTypes;
    private BigDecimal price;
    private String productStatus;

    private List<String> colorCodes;
    private List<String> sizeNames;
    private List<String> materialNames;

    private List<VariantDTO> variants;

    @Data
    public static class VariantDTO {
        private Integer variantId;
        private String colorName;
        private String colorCode;
        private String materialName;
        private String sizeName;
        private Integer stock;
        private BigDecimal price;
    }
}
