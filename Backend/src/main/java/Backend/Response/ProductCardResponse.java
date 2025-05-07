package Backend.Response;

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

    private List<String> colorCodes;
    private List<String> sizeNames;
    private List<String> materialNames;
}
