package Backend.Shared.Security;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import Backend.Domain.Accounts.DTO.Response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
	    if (!response.isCommitted()) {
	        response.setContentType("application/json; charset=UTF-8");
	        response.setCharacterEncoding("UTF-8");
	        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

	        ApiResponse<String> errorResponse = new ApiResponse<>(false, "Bạn không có quyền truy cập!", null);
	        ObjectMapper objectMapper = new ObjectMapper();
	        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
	    }
	}
}
