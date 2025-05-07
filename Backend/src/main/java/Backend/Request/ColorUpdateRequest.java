package Backend.Request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ColorUpdateRequest {
	@Size(min = 3, max = 30, message = "⚠️ Tên màu phải từ 3 - 30 ký tự!")
	@Pattern(regexp = "^[a-zA-ZÀ-Ỹà-ỹ0-9\\s]+$", message = "⚠️ Tên màu chỉ được chứa chữ, số và khoảng trắng!")
	private String colorName;

	@Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "⚠️ Mã màu phải có định dạng hex (VD: #FF0000)!")
	private String colorCode;
}
