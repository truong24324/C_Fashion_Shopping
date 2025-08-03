package Backend.Domain.Product.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ColorRequest {
	@NotBlank(message = "⚠️ Tên màu không được để trống!")
	@Size(min = 3, max = 30, message = "⚠️ Tên màu phải từ 3 - 30 ký tự!")
	@Pattern(regexp = "^[a-zA-ZÀ-Ỹà-ỹ0-9\\s]+$", message = "⚠️ Tên màu chỉ được chứa chữ, số và khoảng trắng!")
	private String colorName;

	@NotBlank(message = "⚠️ Mã màu không được để trống!")
	@Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "⚠️ Mã màu phải có định dạng hex (VD: #FF0000)!")
	private String colorCode;
}
