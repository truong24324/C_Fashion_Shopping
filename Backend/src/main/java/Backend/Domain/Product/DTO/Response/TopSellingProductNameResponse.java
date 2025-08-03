package Backend.Domain.Product.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopSellingProductNameResponse {
    private Integer productId;
    private String productName;
    private Long totalSold;
}
