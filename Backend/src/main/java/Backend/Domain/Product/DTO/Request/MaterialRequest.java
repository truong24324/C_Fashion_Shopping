package Backend.Domain.Product.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MaterialRequest {
    @NotBlank(message = "Tên chất liệu không được để trống!")
    private String materialName;
}
