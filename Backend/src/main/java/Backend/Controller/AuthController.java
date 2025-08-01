package Backend.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "APIs liên quan đến xác thực (đăng nhập, đăng ký, đăng xuất)")
public class AuthController {

	private final AccountService accountService;
	private final JwtService jwtService;
	private final RoleService roleService;

	@Operation(summary = "Đăng nhập", description = "Xác thực người dùng và trả về JWT token.", responses = {
			@ApiResponse(responseCode = "200", description = "Đăng nhập thành công", content = @Content(schema = @Schema(implementation = AuthResponse.class))),
			@ApiResponse(responseCode = "401", description = "Thông tin đăng nhập không hợp lệ"),
			@ApiResponse(responseCode = "403", description = "Tài khoản bị khóa hoặc quyền đăng nhập bị tắt") })
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

			// Kiểm tra tài khoản có hoạt động không
			if (!account.isActive()) {
				return ResponseEntity.status(403).body(new AuthResponse("Tài khoản đã bị vô hiệu hóa."));
			}

			if (account.isLocked()) {
				return ResponseEntity.status(403).body(new AuthResponse("Tài khoản đã bị khóa."));
			}

			// Kiểm tra quyền đăng nhập
			Role role = account.getRole(); // Lấy vai trò của tài khoản
			if (role != null && !role.isLoginAllowed()) {
				return ResponseEntity.status(403).body(new AuthResponse("Quyền đăng nhập bị tắt cho vai trò của bạn."));
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
			String refreshToken = jwtService.generateRefreshToken(account);

			// Lưu vào cookie
			Cookie cookie = new Cookie("jwt_token", token);
			cookie.setHttpOnly(true);
			cookie.setSecure(true);
			cookie.setPath("/");
			cookie.setMaxAge(24 * 60 * 60);
			response.addCookie(cookie);

			Cookie refreshCookie = new Cookie("refresh_token", refreshToken);
			refreshCookie.setHttpOnly(true);
			refreshCookie.setPath("/");
			refreshCookie.setMaxAge((int) (jwtService.getRefreshTokenExpirationMillis() / 1000));
			response.addCookie(refreshCookie);

			return ResponseEntity.ok().header("Authorization", "Bearer " + token)
					.body(new AuthResponse("Đăng nhập thành công!", token, refreshToken));

		} catch (RuntimeException e) {
			return ResponseEntity.status(401).body(new AuthResponse("Lỗi đăng nhập: " + e.getMessage()));
		}
	}

	@Operation(summary = "Làm mới token", description = "Tạo lại access token từ refresh token.")
	@PostMapping("/refresh-token")
	public ResponseEntity<AuthResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
		String refreshToken = null;
		for (Cookie cookie : request.getCookies()) {
			if ("refresh_token".equals(cookie.getName())) {
				refreshToken = cookie.getValue();
				break;
			}
		}

		if (refreshToken == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new AuthResponse("Không tìm thấy refresh token"));
		}

		try {
			String username = jwtService.extractUsername(refreshToken);
			Account account = accountService.findByEmail(username)
					.orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

			if (!jwtService.isTokenValid(refreshToken, account)) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(new AuthResponse("Refresh token không hợp lệ"));
			}

			String newAccessToken = jwtService.generateToken(account);

			Cookie accessCookie = new Cookie("jwt_token", newAccessToken);
			accessCookie.setHttpOnly(true);
			accessCookie.setPath("/");
			accessCookie.setMaxAge(24 * 60 * 60);
			response.addCookie(accessCookie);

			return ResponseEntity.ok(new AuthResponse("Làm mới token thành công!", newAccessToken, refreshToken));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new AuthResponse("Lỗi làm mới token: " + e.getMessage()));
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

			return ResponseEntity.ok(new AuthResponse("Đăng ký thành công!", token, null));

		} catch (Exception e) {
			return ResponseEntity.status(500).body(new AuthResponse("Lỗi hệ thống: " + e.getMessage()));
		}
	}

	@PostMapping("/qr-login-info")
	public ResponseEntity<Map<String, String>> generateQRLoginInfo(@RequestHeader("Authorization") String bearerToken) {
		if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
			return ResponseEntity.badRequest().body(Map.of("error", "Thiếu access token"));
		}

		String accessToken = bearerToken.substring(7);
		String email = jwtService.extractUsername(accessToken);
		Account account = accountService.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

		if (!jwtService.isTokenValid(accessToken, account)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token không hợp lệ"));
		}

		String refreshToken = jwtService.generateRefreshToken(account);
		String newAccessToken = jwtService.generateToken(account);

		return ResponseEntity.ok(Map.of(
				"accessToken", newAccessToken,
				"refreshToken", refreshToken));
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

	@GetMapping("/check-admin")
	@Operation(summary = "Kiểm tra quyền Admin", description = "Kiểm tra xem người dùng có quyền Admin hay không.", responses = {
			@ApiResponse(responseCode = "200", description = "Người dùng có quyền Admin", content = @Content(schema = @Schema(type = "boolean"))),
			@ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc tài khoản không hợp lệ"),
			@ApiResponse(responseCode = "403", description = "Không có quyền truy cập") })
	public ResponseEntity<?> checkAdminAccess(@AuthenticationPrincipal Account account) {
		if (account == null || !account.isEnabled()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
		}

		boolean hasAccess = account.getAuthorities().stream()
				.anyMatch(auth -> auth.getAuthority().equals("ROLE_Admin") ||
						auth.getAuthority().equals("ROLE_Super_Admin") ||
						auth.getAuthority().equals("ROLE_Manager"));

		if (hasAccess) {
			return ResponseEntity.ok(true);
		} else {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
		}
	}
}
