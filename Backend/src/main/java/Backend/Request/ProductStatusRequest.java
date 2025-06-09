package Backend.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductStatusRequest {

    @NotBlank(message = "Tên trạng thái sản phẩm không được để trống.")
    @Size(max = 50, message = "Tên trạng thái sản phẩm không được quá 50 ký tự.")
    private String statusName;

    private Boolean isActive; // Mặc định là true

    @Size(max = 255, message = "Mô tả không được quá 255 ký tự.")
    private String description;


}
