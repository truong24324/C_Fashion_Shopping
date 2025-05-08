package Backend.Response;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class WishlistProductResponse {
    private Integer productId;
    private String productName;
    private String mainImageUrl;
    private BigDecimal minPrice;

    public WishlistProductResponse(Integer productId, String productName, String mainImageUrl, BigDecimal minPrice) {
        this.productId = productId;
        this.productName = productName;
        this.mainImageUrl = mainImageUrl;
        this.minPrice = minPrice;
    }
}
