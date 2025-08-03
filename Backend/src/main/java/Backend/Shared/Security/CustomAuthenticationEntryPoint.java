package Backend.Shared.Security;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import Backend.Domain.Accounts.DTO.Response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
	    if (!response.isCommitted()) {
	        response.setContentType("application/json; charset=UTF-8");
	        response.setCharacterEncoding("UTF-8");
	        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

	        ApiResponse<String> errorResponse = new ApiResponse<>(false, "Bạn chưa đăng nhập!", null);
	        ObjectMapper objectMapper = new ObjectMapper();
	        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
	    }
	}

}
