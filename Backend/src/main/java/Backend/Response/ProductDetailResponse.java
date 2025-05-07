package Backend.Response;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class ProductDetailResponse {
    private String brandName;
    private String categoryName;
    private String productName;
    private String description;
    private String barcode;
    private String model;
    private String warrantyPeriod;
    private String supplierName;

    private List<String> colorNames;
    private List<String> sizeNames;
    private List<String> materialNames;

    private List<ImageDTO> images;
    private List<VariantDTO> variants;

    @Data
    public static class ImageDTO {
        private String imageUrl;
        private String imageType;
    }

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
