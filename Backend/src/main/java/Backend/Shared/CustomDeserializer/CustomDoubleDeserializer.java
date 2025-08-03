package Backend.Shared.CustomDeserializer;
import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

public class CustomDoubleDeserializer extends JsonDeserializer<Double> {
    @Override
    public Double deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText();
        // Loại bỏ tất cả ký tự không phải là số và dấu chấm
        String cleanedValue = value.replaceAll("[^\\d.]", "");
        try {
            return Double.parseDouble(cleanedValue); // Chuyển đổi thành Double
        } catch (NumberFormatException e) {
            return null; // Nếu không thể chuyển đổi, trả về null
        }
    }
}
