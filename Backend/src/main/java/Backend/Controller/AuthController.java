package Backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Backend.Model.Account;
import Backend.Model.Role;
import Backend.Request.LoginRequest;
import Backend.Request.RegisterRequest;
import Backend.Response.AuthResponse;
import Backend.Service.AccountService;
import Backend.Service.JwtService;
import Backend.Service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "Authentication", description = "APIs liên quan đến xác thực (đăng nhập, đăng ký, đăng xuất)")
public class AuthController {

	private final AccountService accountService;
	private final JwtService jwtService;
	private final RoleService roleService;

	@Operation(summary = "Đăng nhập", description = "Xác thực người dùng và trả về JWT token.", responses = {
			@ApiResponse(responseCode = "200", description = "Đăng nhập thành công", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
			@ApiResponse(responseCode = "401", description = "Thông tin đăng nhập không hợp lệ"),
			@ApiResponse(responseCode = "403", description = "Tài khoản bị khóa") })
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request,
			HttpServletResponse response) {
		try {
			Account account = accountService.findByEmail(loginRequest.getEmail())
					.orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

			// Kiểm tra tài khoản bị khóa
			if (accountService.isAccountLocked(account)) {
				long remainingTime = account.getLockUntil().getTime() - System.currentTimeMillis();
				return ResponseEntity.status(403).body(new AuthResponse(
						"Tài khoản bị khóa. Hãy thử lại sau " + (remainingTime / (1000 * 60)) + " phút."));
			}

			// Kiểm tra mật khẩu
			String errorMessage = accountService.validateLogin(account, loginRequest.getPassword());
			if (errorMessage != null) {
				return ResponseEntity.status(401).body(new AuthResponse(errorMessage));
			}

			// Lưu thông tin đăng nhập
			account.setIpAddress(request.getRemoteAddr());
			account.setDeviceName(request.getHeader("User-Agent"));
			accountService.save(account);

			// Tạo JWT
			String token = jwtService.generateToken(account);

			// Lưu vào cookie
			Cookie cookie = new Cookie("jwt_token", token);
			cookie.setHttpOnly(true);
			cookie.setSecure(false);
			cookie.setPath("/");
			cookie.setMaxAge(24 * 60 * 60);
			response.addCookie(cookie);

			return ResponseEntity.ok().header("Authorization", "Bearer " + token)
					.body(new AuthResponse("Đăng nhập thành công!", token));

		} catch (RuntimeException e) {
			return ResponseEntity.status(401).body(new AuthResponse("Lỗi đăng nhập: " + e.getMessage()));
		}
	}

    @Operation(summary = "Đăng ký", description = "Tạo tài khoản mới.", responses = {
            @ApiResponse(responseCode = "200", description = "Đăng ký thành công", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "Email hoặc số điện thoại đã được sử dụng"),
            @ApiResponse(responseCode = "500", description = "Lỗi hệ thống")
    })
	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest,
			HttpServletResponse response) {
		try {
			if (accountService.existsByEmail(registerRequest.getEmail())) {
				return ResponseEntity.badRequest().body(new AuthResponse("Email đã được sử dụng"));
			}
			if (accountService.existsByPhone(registerRequest.getPhone())) {
				return ResponseEntity.badRequest().body(new AuthResponse("Số điện thoại đã được sử dụng"));
			}
			if (accountService.existsByUserCode(registerRequest.getUserCode())) {
				return ResponseEntity.badRequest().body(new AuthResponse("Mã người dùng đã tồn tại"));
			}

			Role defaultRole = roleService.findRoleByName("Customer");
			if (defaultRole == null) {
				return ResponseEntity.status(500).body(new AuthResponse("Vai trò 'Customer' không tồn tại"));
			}

			Account account = accountService.registerNewAccount(registerRequest, defaultRole);
			String token = jwtService.generateToken(account);

			Cookie cookie = new Cookie("jwt_token", token);
			cookie.setHttpOnly(true);
			cookie.setSecure(false);
			cookie.setPath("/");
			cookie.setMaxAge(24 * 60 * 60);
			response.addCookie(cookie);

			return ResponseEntity.ok(new AuthResponse("Đăng ký thành công!", token));

		} catch (Exception e) {
			return ResponseEntity.status(500).body(new AuthResponse("Lỗi hệ thống: " + e.getMessage()));
		}
	}


    @Operation(summary = "Đăng xuất", description = "Xóa JWT khỏi cookie và đăng xuất người dùng.", responses = {
            @ApiResponse(responseCode = "200", description = "Đăng xuất thành công", content = @Content(schema = @Schema(implementation = AuthResponse.class)))
    })
	@PostMapping("/logout")
	public ResponseEntity<AuthResponse> logout(HttpServletResponse response) {
		// Xóa cookie chứa JWT token
		Cookie jwtCookie = new Cookie("jwt_token", null);
		jwtCookie.setHttpOnly(true);
		jwtCookie.setSecure(false); // Set true nếu dùng HTTPS
		jwtCookie.setPath("/");
		jwtCookie.setMaxAge(0); // Hết hạn ngay lập tức
		response.addCookie(jwtCookie);

		// Xóa cookie chứa account_id (nếu có)
		Cookie accountIdCookie = new Cookie("account_id", null);
		accountIdCookie.setHttpOnly(false);
		accountIdCookie.setSecure(false);
		accountIdCookie.setPath("/");
		accountIdCookie.setMaxAge(0);
		response.addCookie(accountIdCookie);

		return ResponseEntity.ok(new AuthResponse("Đăng xuất thành công!"));
	}

}
