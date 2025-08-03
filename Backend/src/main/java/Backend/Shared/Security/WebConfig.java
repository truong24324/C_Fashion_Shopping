package Backend.Shared.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import Backend.Domain.Accounts.Service.AccountService;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    registry.addResourceHandler("/uploads/**")
	    .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/");
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOriginPatterns("*").allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
				.allowedOrigins("http://localhost:3000")
				.allowedOriginPatterns("*") // Cho phép tất cả domain truy cập
				.allowedHeaders("*", "Authorization", "Content-Type")// Cho phép FE đọc Authorization từ response
				.allowedHeaders("*") // Cho phép tất cả các header trong request
				.exposedHeaders("Authorization") // Cho phép FE đọc header Authorization từ response
				.allowCredentials(true);
	}

    @Bean
    RestTemplate restTemplate() {
		return new RestTemplate();
	}

    @Bean
    AccountService accountService() {
		return new AccountService();
	}

}
