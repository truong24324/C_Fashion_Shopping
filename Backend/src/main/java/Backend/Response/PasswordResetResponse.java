package Backend.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetResponse {

    private String message;
    private int statusCode;
    private int remainingAttempts;

    public PasswordResetResponse(String message, int statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
