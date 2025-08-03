package Backend.Domain.Order.Integration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Hex;
import org.springframework.stereotype.Component;

@Component
public class MomoUtil {

    public String generateSignature(String rawData, String secretKey) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes("UTF-8"), "HmacSHA256");
        sha256_HMAC.init(secret_key);

        byte[] hash = sha256_HMAC.doFinal(rawData.getBytes("UTF-8"));
        return Hex.encodeHexString(hash);
    }
}
