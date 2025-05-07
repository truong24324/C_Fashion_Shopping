package Backend.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SupplierRequest {

	@NotBlank(message = "Tên nhà cung cấp không được để trống!")
	@Size(max = 100, message = "Tên nhà cung cấp không được vượt quá 100 ký tự!")
	@Pattern(regexp = "^(?![0-9])(?!\\s+$)[a-zA-Z0-9À-ỹ\\s\\-\\.\\'\\,]+$",
	         message = "Tên nhà cung cấp không được bắt đầu bằng số, chỉ được chứa chữ cái, số, khoảng trắng, dấu '-', '.', ',' và không chỉ gồm khoảng trắng!")
	private String supplierName;

	@Size(max = 100, message = "Tên liên hệ không được vượt quá 100 ký tự!")
	@Pattern(regexp = "^(?![0-9])(?!\\s+$)[a-zA-Z0-9À-ỹ\\s\\-\\.\\'\\,]+$",
	         message = "Tên liên hệ không được bắt đầu bằng số, chỉ được chứa chữ cái, số, khoảng trắng, dấu '-', '.', ',' và không chỉ gồm khoảng trắng!")
	private String contactName;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Số điện thoại chỉ được chứa số, từ 8 đến 15 ký tự, có thể bắt đầu bằng dấu '+'!")
    @Size(min = 10, max = 15, message = "Số điện thoại phải có từ 8 đến 15 ký tự!")
    private String phone;

    @Email(message = "Email không hợp lệ!")
    @Size(max = 100, message = "Email không được vượt quá 100 ký tự!")
    private String email;

    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự!")
    private String address;


}
