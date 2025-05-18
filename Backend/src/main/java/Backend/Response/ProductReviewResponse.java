package Backend.Response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductReviewResponse {
    private Integer reviewId;
    private Long accountId;
    private String accountName;
    private Integer productId;
    private Integer variantId;

    private Integer rating;
    private String title;
    private String content;
    private String imageUrl;
    private Boolean isVisible;
    private LocalDateTime createdAt;
}
