package Backend.Response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
