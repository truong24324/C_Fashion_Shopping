package Backend.Request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AccountRequest {

    @NotBlank(message = "Mã người dùng không được để trống")
    private String userCode;

    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(min = 10, max = 12, message = "Số điện thoại phải từ 10 đến 12 số")
    private String phone;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    @NotNull(message = "Vai trò không được để trống")
    private Long roleId;
}
