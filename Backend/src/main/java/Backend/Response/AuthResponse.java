package Backend.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private String token;

    private String refreshToken;

    public AuthResponse(String message) {
        this.message = message;
        this.token = this.token;
        this.refreshToken = this.refreshToken;
    }

}
