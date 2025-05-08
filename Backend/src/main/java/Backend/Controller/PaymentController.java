package Backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Backend.Request.OrderRequest;
import Backend.Response.PaymentResponse;
import Backend.Service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayService vnPayService;

    @PostMapping("/create-vnpay")
    public ResponseEntity<PaymentResponse> createVnpayPayment(@RequestParam long amount,
                                                              @RequestParam(required = false) String bankCode,
                                                              @RequestBody OrderRequest order,
                                                              HttpServletRequest request) {
        PaymentResponse res = vnPayService.createPaymentUrl(amount, bankCode, request, order);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/vn-pay-return")
    public ResponseEntity<String> vnPayReturn(HttpServletRequest request) {
        vnPayService.handlePaymentReturn(request);
        return ResponseEntity.ok("Cảm ơn bạn đã thanh toán!");
    }
}
