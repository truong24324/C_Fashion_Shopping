package Backend.Request;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @JsonProperty("email")
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10,12}$", message = "Số điện thoại không hợp lệ")
    @JsonProperty("phone")
    private String phone;

    @NotBlank(message = "Mã người dùng không được để trống")
    @Pattern(regexp = "^[a-zA-Z0-9_]{6,20}$", message = "Mã người dùng chỉ chứa chữ cái, số và dấu gạch dưới")
    @JsonProperty("userCode")
    private String userCode;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    @JsonProperty("password")
    private String password;
}
