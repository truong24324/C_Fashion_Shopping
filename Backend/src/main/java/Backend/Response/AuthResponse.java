package Backend.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private String token;

    // ✅ Constructor chỉ có token (trường hợp cũ)
    public AuthResponse(String token) {
        this.token = token;
    }

}
