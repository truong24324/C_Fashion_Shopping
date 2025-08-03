package Backend.Domain.Product.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductSimpleResponse {
	private Integer productId;
    private String productName;
    private String description;
    private String barcode;
    private String brandName;
    private String categoryName;
    private String supplierName;
    private String model;
    private String warrantyPeriod;
}
