package Backend.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SizeRequest {
    @NotBlank(message = "Tên kích thước không được để trống!")
    private String sizeName;
}
