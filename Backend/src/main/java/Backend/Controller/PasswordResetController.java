package Backend.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Backend.Response.PasswordResetResponse;
import Backend.Service.PasswordResetService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/password")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/request-reset")
    public ResponseEntity<PasswordResetResponse> requestReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        try {
            // Gọi phương thức gửi OTP
            passwordResetService.sendOtp(email);

            // Trả về phản hồi thành công
            PasswordResetResponse response = new PasswordResetResponse("Mã OTP đã được gửi đến email của bạn.", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Xử lý trường hợp email bị thiếu hoặc không hợp lệ
            PasswordResetResponse response = new PasswordResetResponse(e.getMessage(), HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); // 400 Bad Request
        } catch (RuntimeException e) {
            // Xử lý trường hợp email không tồn tại trong hệ thống
            PasswordResetResponse response = new PasswordResetResponse(e.getMessage(), HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response); // 404 Not Found
        } catch (Exception e) {
            // Xử lý các lỗi không mong muốn khác
            PasswordResetResponse response = new PasswordResetResponse("Đã có lỗi xảy ra, vui lòng thử lại sau.", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // 500 Internal Server Error
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<PasswordResetResponse> verifyOtp(@RequestBody Map<String, String> request) {
        String otp = request.get("otp");
        boolean isValid = passwordResetService.verifyOtp(otp);

        PasswordResetResponse response;
        if (isValid) {
            response = new PasswordResetResponse("OTP hợp lệ. Bạn có thể đặt lại mật khẩu.", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } else {
            response = new PasswordResetResponse("OTP không hợp lệ, đã hết hạn hoặc bạn đã nhập sai quá số lần cho phép.", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/update-max-attempts")
    public ResponseEntity<PasswordResetResponse> updateMaxAttempts(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        int remainingAttempts = passwordResetService.decreaseOtpAttempts(email);

        PasswordResetResponse response;
        if (remainingAttempts > 0) {
            response = new PasswordResetResponse("Số lần nhập OTP còn lại: " + remainingAttempts, HttpStatus.OK.value(), remainingAttempts);
            return ResponseEntity.ok(response);
        } else if (remainingAttempts == 0) {
            response = new PasswordResetResponse("Bạn đã nhập sai quá số lần cho phép. Tài khoản đã bị khóa.", HttpStatus.FORBIDDEN.value(), 0);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } else {
            response = new PasswordResetResponse("Không thể giảm số lần nhập OTP. OTP có thể đã hết hạn.", HttpStatus.BAD_REQUEST.value(), -1);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }


    @PostMapping("/reset-password")
    public ResponseEntity<PasswordResetResponse> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        boolean isSuccess = passwordResetService.resetPassword(email, otp, newPassword);

        PasswordResetResponse response;
        if (isSuccess) {
            response = new PasswordResetResponse("Mật khẩu đã được thay đổi thành công.", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } else {
            response = new PasswordResetResponse("OTP không hợp lệ, đã hết hạn hoặc có lỗi trong quá trình thay đổi mật khẩu.", HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
