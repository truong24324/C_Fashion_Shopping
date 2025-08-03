package Backend.Domain.Product.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SizeRequest {
    @NotBlank(message = "Tên kích thước không được để trống!")
    private String sizeName;
}
