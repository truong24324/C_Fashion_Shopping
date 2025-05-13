package Backend.Configuration;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import Backend.Model.Account;
import Backend.Model.Role;
import Backend.Service.AccountService;
import Backend.Service.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    private final AccountService accountService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            // Lấy Header Authorization
            final String authHeader = request.getHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            // Lấy token từ Header
            String token = authHeader.substring(7);
            String username = jwtService.extractUsername(token);
            String accountId = jwtService.extractAccountId(token);

            // Kiểm tra SecurityContextHolder đã có Authentication chưa
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

             // 🛑 4. Kiểm tra tài khoản có bị khóa không
                Account account = accountService.findByEmail(username)
                        .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

                if (!account.isActive()) {
                    logger.warn("Tài khoản bị vô hiệu hóa: " + username);
                    sendErrorResponse(response, "Tài khoản đã bị vô hiệu hóa");
                    return;
                }

                if (account.isLocked()) {
                    logger.warn("Tài khoản bị khóa: " + username);
                    sendErrorResponse(response, "Tài khoản đã bị khóa");
                    return;
                }

                Role role = account.getRole();
                if (role != null && !role.isLoginAllowed()) {
                    logger.warn("Quyền đăng nhập bị tắt cho tài khoản: " + username);
                    sendErrorResponse(response, "Quyền đăng nhập bị tắt cho vai trò của bạn.");
                    return;
                }
                
                // Kiểm tra token hợp lệ
                if (jwtService.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Thiết lập Authentication
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    request.setAttribute("accountId", accountId);
                }
            }
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            logger.warn("JWT token đã hết hạn", e);
            sendErrorResponse(response, "Token đã hết hạn");
        } catch (DisabledException e) {
            logger.warn("Tài khoản bị vô hiệu hóa", e);
            sendErrorResponse(response, "Tài khoản bị vô hiệu hóa");
        } catch (Exception e) {
            logger.error("Xác thực không thành công", e);
            sendErrorResponse(response, "Xác thực không thành công");
        }
    }

    private void sendErrorResponse(HttpServletResponse response, String errorMessage) throws IOException {
        if (!response.isCommitted()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            String jsonError = String.format("{\"status\": %d, \"error\": \"Unauthorized\", \"message\": \"%s\"}",
                    HttpServletResponse.SC_UNAUTHORIZED, errorMessage);
            response.getWriter().write(jsonError);
        }
    }

}