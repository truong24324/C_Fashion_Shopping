package Backend.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import Backend.Model.Account;
import Backend.Repository.AccountRepository;
import lombok.RequiredArgsConstructor;

@Configuration // Đánh dấu lớp này là cấu hình của Spring
@EnableWebSecurity // Kích hoạt bảo mật web của Spring Security
@RequiredArgsConstructor // Tạo constructor cho các trường final tự động
public class ApplicationConfig {

	private final AccountRepository accountRepository; // Repository để truy vấn tài khoản người dùng

    // Bean để cung cấp dịch vụ tìm kiếm người dùng theo tên (email) trong cơ sở dữ
    // liệu
    @Bean
    UserDetailsService userDetailsService() {
	    return email -> {
	        Account account = accountRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

	        if (!account.isEnabled()) {
	            throw new RuntimeException("Tài khoản người dùng đã bị khóa");
	        }

	        return account; // Account phải implement UserDetails
	    };
	}


    // Bean để mã hóa mật khẩu bằng BCrypt
    @Bean
    PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(); // Sử dụng BCryptPasswordEncoder để mã hóa mật khẩu
	}

    // Bean để cung cấp AuthenticationProvider sử dụng DaoAuthenticationProvider
    @Bean
    AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setPasswordEncoder(passwordEncoder()); // Cấu hình mã hóa mật khẩu
		provider.setUserDetailsService(userDetailsService()); // Cung cấp UserDetailsService để tìm tài khoản
		return provider;
	}

    // Bean để cung cấp AuthenticationManager từ AuthenticationConfiguration của
    // Spring Security
    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager(); // Trả về AuthenticationManager để quản lý xác thực
	}
}
