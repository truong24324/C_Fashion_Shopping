package Backend.Response;

import Backend.Model.ImageType;
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
}
