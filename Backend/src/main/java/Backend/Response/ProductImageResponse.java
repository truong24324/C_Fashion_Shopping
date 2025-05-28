package Backend.Response;

import java.time.LocalDateTime;

import Backend.Model.ImageType;
import Backend.Model.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductImageResponse {
    private Integer imageId;
    private Integer productId;
    private String imageUrl;
    private ImageType imageType;
    private String productName;
    private LocalDateTime createdAt;

    public ProductImageResponse(ProductImage image) {
        this.imageId = image.getImageId();
        this.productId = image.getProduct().getProductId();
        this.productName = image.getProduct().getProductName();
        this.imageUrl = image.getImageUrl();
        this.imageType = image.getImageType();
        this.createdAt = image.getCreatedAt();
    }
}
