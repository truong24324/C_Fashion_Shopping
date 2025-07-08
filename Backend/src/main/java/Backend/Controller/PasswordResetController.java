package Backend.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import Backend.Service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import Backend.Response.ApiResponse;
import Backend.Request.PasswordResetRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/password")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/request-reset")
    public ResponseEntity<ApiResponse<Void>> requestReset(@RequestBody @Valid PasswordResetRequest request) {
        String email = request.getEmail();
        try {
            passwordResetService.sendOtp(email);
            ApiResponse<Void> response = new ApiResponse<>(true, "Mã OTP đã được gửi đến email của bạn.", null);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            ApiResponse<Void> response = new ApiResponse<>(false, e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (RuntimeException e) {
            ApiResponse<Void> response = new ApiResponse<>(false, e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            ApiResponse<Void> response = new ApiResponse<>(false, "Đã có lỗi xảy ra, vui lòng thử lại sau.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@RequestBody PasswordResetRequest request) {
        String otp = request.getOtp();
        boolean isValid = passwordResetService.verifyOtp(otp);

        ApiResponse<Void> response;
        if (isValid) {
            response = new ApiResponse<>(true, "OTP hợp lệ. Bạn có thể đặt lại mật khẩu.", null);
            return ResponseEntity.ok(response);
        } else {
            response = new ApiResponse<>(false,
                    "OTP không hợp lệ, đã hết hạn hoặc bạn đã nhập sai quá số lần cho phép.", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/update-max-attempts")
    public ResponseEntity<ApiResponse<Integer>> updateMaxAttempts(@RequestBody PasswordResetRequest request) {
        String email = request.getEmail();
        int remainingAttempts = passwordResetService.decreaseOtpAttempts(email);

        ApiResponse<Integer> response;
        if (remainingAttempts > 0) {
            response = new ApiResponse<>(true, "Số lần nhập OTP còn lại: " + remainingAttempts, remainingAttempts);
            return ResponseEntity.ok(response);
        } else if (remainingAttempts == 0) {
            response = new ApiResponse<>(false, "Bạn đã nhập sai quá số lần cho phép. Tài khoản đã bị khóa.", 0);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } else {
            response = new ApiResponse<>(false, "Không thể giảm số lần nhập OTP. OTP có thể đã hết hạn.", -1);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody PasswordResetRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();
        String newPassword = request.getNewPassword();

        boolean isSuccess = passwordResetService.resetPassword(email, otp, newPassword);

        ApiResponse<Void> response;
        if (isSuccess) {
            response = new ApiResponse<>(true, "Mật khẩu đã được thay đổi thành công.", null);
            return ResponseEntity.ok(response);
        } else {
            response = new ApiResponse<>(false,
                    "OTP không hợp lệ, đã hết hạn hoặc có lỗi trong quá trình thay đổi mật khẩu.", null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(@RequestBody @Valid PasswordResetRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Lấy email từ token xác thực (Authentication)
        String email = userDetails.getUsername();
        String currentPassword = request.getCurrentPassword();
        String newPassword = request.getNewPassword();

        try {
            passwordResetService.updatePassword(email, currentPassword, newPassword);
            ApiResponse<Void> response = new ApiResponse<>(true, "Mật khẩu đã được cập nhật thành công.", null);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            ApiResponse<Void> response = new ApiResponse<>(false, e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (RuntimeException e) {
            ApiResponse<Void> response = new ApiResponse<>(false, e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            ApiResponse<Void> response = new ApiResponse<>(false, "Đã có lỗi xảy ra, vui lòng thử lại sau.", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
