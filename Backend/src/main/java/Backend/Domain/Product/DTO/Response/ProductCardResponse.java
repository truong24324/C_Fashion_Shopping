package Backend.Domain.Product.DTO.Response;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class ProductCardResponse {
    private Integer productId;
    private String productName;
    private String model;
    private List<String> image;
    private List<String> imageTypes;
    private BigDecimal price;
    private String productStatus;

    private List<String> colorCodes;
    private List<String> sizeNames;
    private List<String> materialNames;
    private List<VariantSummaryResponse> variants;

    @Data
    public class VariantSummaryResponse {
        private String colorCode;
        private String sizeName;
        private String materialName;
        private BigDecimal price;
        private Integer stock;
    }
}
