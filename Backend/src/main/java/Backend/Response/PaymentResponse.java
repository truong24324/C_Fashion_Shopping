package Backend.Response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    public String code;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String paymentUrl;

    public PaymentResponse(String code){
        this.code = code;
    }
}
