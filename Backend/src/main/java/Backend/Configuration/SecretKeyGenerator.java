package Backend.Configuration;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Base64;

public class SecretKeyGenerator {
    public static void main(String[] args) {
        byte[] key = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();
        String base64Key = Base64.getEncoder().encodeToString(key);
        System.out.println("Base64 Secret Key: " + base64Key);
    }
}
