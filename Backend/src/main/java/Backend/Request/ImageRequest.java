package Backend.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class ImageRequest {

    @NotBlank(message = "Đường dẫn ảnh không được để trống")
    private String imageUrl;

    @NotNull(message = "Loại ảnh không được để trống")
    private String imageType;  // MAIN, SECONDARY, OTHER


}
