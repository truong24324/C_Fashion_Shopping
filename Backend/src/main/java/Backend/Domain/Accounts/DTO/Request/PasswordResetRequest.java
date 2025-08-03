package Backend.Domain.Accounts.DTO.Request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
public class PasswordResetRequest {
    @Email(message = "Email không hợp lệ")
    private String email;

    @Size(min = 6, max = 6, message = "Mã OTP phải có 6 ký tự")
    @Pattern(regexp = "^[0-9]{6}$", message = "Mã OTP chỉ chứa các chữ số từ 0 đến 9")
    @EqualsAndHashCode.Exclude
    private String otp;

    @Size(min = 6, max = 50, message = "Mật khẩu mới phải từ 6 đến 50 ký tự")
      @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+=<>?{}\\[\\]~-]).{8,64}$",
        message = "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
    )
    private String newPassword;

    @NotBlank(message = "Mật khẩu hiện tại không được để trống")
    @Size(min = 6, max = 50, message = "Mật khẩu hiện tại phải từ 6 đến 50 ký tự")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+=<>?{}\\[\\]~-]).{8,64}$",
        message = "Mật khẩu hiện tại phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
    )
    private String currentPassword;
}
