package Backend.Request;

import org.springframework.web.multipart.MultipartFile;

import Backend.Model.ImageType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductImageRequest {
    private Integer imageId;
    private Integer productId;
    private MultipartFile imageFile;
    private ImageType imageType;

}
