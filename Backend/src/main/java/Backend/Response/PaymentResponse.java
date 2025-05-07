package Backend.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private String code;        // Mã kết quả (ví dụ: "00" thành công)
    private String paymentUrl;  // URL thanh toán từ VNPay
}
