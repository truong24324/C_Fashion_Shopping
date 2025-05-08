package Backend.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaterialRequest {
    @NotBlank(message = "Tên chất liệu không được để trống!")
    private String materialName;
}
