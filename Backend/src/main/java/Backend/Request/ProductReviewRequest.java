package Backend.Request;

import lombok.Data;

@Data
public class ProductReviewRequest {
    private Integer orderDetailId;
    private Integer accountId;
    private Integer productId;
    private Integer variantId;

    private Integer rating;
    private String title;
    private String content;
    private String imageUrl;
}
