package Backend.Response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductReviewResponse {
    private Integer reviewId;
    private Long accountId;
    private String accountName;
    private Integer productId;
    private Integer variantId;
    private String productStatus;

    private Integer rating;
    private String title;
    private String content;
    private String imageUrl;
    private Boolean isVisible;
    private LocalDateTime createdAt;
}
