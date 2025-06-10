package Backend.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import Backend.Model.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.refreshExpiration}")
    private long refreshExpiration; // Refresh token expiration time

    // Tạo token từ account
    public String generateToken(Account account) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", account.getEmail()); // Đảm bảo email đúng
        claims.put("accountId", String.valueOf(account.getAccountId()));
        claims.put("roles", account.getAuthorities()); // Thêm vai trò vào token

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(account.getEmail()) // <-- Đảm bảo setSubject đúng email
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Kiểm tra token có hợp lệ không
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // Kiểm tra token đã hết hạn chưa
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Trích xuất thời gian hết hạn của token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Lấy email từ token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Lấy một claims cụ thể từ token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Lấy tất cả claims từ token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Lấy khóa ký từ secretKey
    private Key getSignInKey() {
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException("Secret Key chưa được cấu hình hoặc bị null!");
        }
        byte[] keyBytes = Decoders.BASE64.decode(secretKey); // vẫn dùng base64 decode
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Trích xuất accountId từ token
    public String extractAccountId(String token) {
        return extractClaim(token, claims -> claims.get("accountId", String.class));
    }

    // Lấy email từ token
    public String getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (SignatureException e) {
            throw new RuntimeException("Không thể giải mã token", e);
        }
    }

    public boolean isTokenExpiringSoon(String token, int minutes) {
        Date expiration = extractExpiration(token);
        return expiration != null && expiration.getTime() - System.currentTimeMillis() < minutes * 60 * 1000;
    }

    public String generateRefreshToken(Account account) {
        // Thường chỉ cần subject, không cần quá nhiều claims
        return Jwts.builder()
                .setSubject(account.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public int getRefreshTokenExpirationMillis() {
        return (int) refreshExpiration;
    }
}