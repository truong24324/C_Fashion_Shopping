package Backend.Domain.Product.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Tên danh mục không được để trống!")
    @Size(max = 100, message = "Tên danh mục không được dài quá 100 ký tự!")
    private String categoryName;

    @Size(max = 255, message = "Mô tả không được dài quá 255 ký tự!")
    private String description;


}
