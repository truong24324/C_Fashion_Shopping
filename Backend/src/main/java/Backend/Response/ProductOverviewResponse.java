package Backend.Response;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class ProductOverviewResponse {
    private Integer productId;
    private String productName;
    private String productStatus;
    private List<String> image;
    private List<String> imageTypes;
    private BigDecimal price;
    private List<String> colorCodes;
    private String brandName;
    private List<String> colorNames;
    private List<String> sizeNames;
    private List<String> materialNames;
    private String supplierName;
    private String warrantyPeriod;
    private String model;
}
