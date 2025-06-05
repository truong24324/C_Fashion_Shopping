package Backend.Controller;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.*;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import Backend.Mailer.SendEmail;
import Backend.Model.Order;
import Backend.Model.OrderDetail;
import Backend.Model.OrderStatus;
import Backend.Model.Variant;
import Backend.Repository.OrderDetailRepository;
import Backend.Repository.OrderRepository;
import Backend.Repository.OrderStatusRepository;
import Backend.Repository.VariantRepository;
import Backend.Request.OrderRequest;
import Backend.Response.ApiResponse;
import Backend.Response.OrderResponse;
import Backend.Response.PaymentResponse;
import Backend.Service.MoMoService;
import Backend.Service.OrderService;
import Backend.Service.VNPayService;
import Backend.Service.VietQRService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@PreAuthorize("hasAnyAuthority('ROLE_Customer')")
@RequiredArgsConstructor
public class PaymentController {

	private final VNPayService vnPayService;
	private final MoMoService momoService;
	private final SendEmail sendEmail;
	private final OrderService orderService;
	private final OrderRepository orderRepository;
	private final OrderDetailRepository orderDetailRepository;
	private final OrderStatusRepository orderStatusRepository;
	private final VariantRepository variantRepository;
	private final VietQRService vietQRService;

	@Value("${payment.momo.secretKey}")
	private String secretKey;

	@PostMapping("/create/vnpay")
	public ResponseEntity<PaymentResponse> createVnpayPayment(@RequestParam long amount,
			@RequestParam(required = false) String bankCode, @RequestBody OrderRequest order,
			HttpServletRequest request) {
		PaymentResponse res = vnPayService.createPaymentUrl(amount, bankCode, request, order);
		return ResponseEntity.ok(res);
	}

	@GetMapping("/vn-pay-return")
	public ResponseEntity<String> vnPayReturn(HttpServletRequest request) {
		vnPayService.handlePaymentReturn(request);
		return ResponseEntity.ok("Cảm ơn bạn đã thanh toán!");
	}

	@PostMapping("/create/momo")
	public ResponseEntity<?> createMomoPayment(@RequestBody OrderRequest orderRequestDto) {
		try {
			PaymentResponse response = momoService.createMomoPayment(orderRequestDto);

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Lỗi khi tạo thanh toán MoMo");
		}
	}

	@PostMapping("/create/COD")
	public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
		List<String> missingFields = new ArrayList<>();

		if (orderRequest.getOrderStatusId() == null) {
			missingFields.add("orderStatusId");
		}
		if (orderRequest.getAccountId() == null) {
			missingFields.add("accountId");
		}
		if (orderRequest.getOrderDetails() == null) {
			missingFields.add("orderDetails");
		}

		if (!missingFields.isEmpty()) {
			String errorMessage = "Dữ liệu đầu vào không hợp lệ. Thiếu: " + String.join(", ", missingFields);
			return ResponseEntity.badRequest().body(new ApiResponse<>(false, errorMessage, null));
		}

		try {
			Order createdOrder = orderService.placeOrder(orderRequest);
			OrderResponse orderResponse = orderService.convertToResponse(createdOrder);
			sendEmail.sendOrderConfirmationEmail(createdOrder.getEmail(), createdOrder);
			return ResponseEntity.ok(new ApiResponse<>(true, "Đặt hàng thành công", orderResponse));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(500)
					.body(new ApiResponse<>(false, "Lỗi hệ thống khi tạo đơn hàng: " + e.getMessage(), null));
		}
	}

	@PostMapping("/create/VietQR")
	public ResponseEntity<?> createOrderWithVietQR(@Valid @RequestBody OrderRequest orderRequest) {
		List<String> missingFields = new ArrayList<>();

		if (orderRequest.getOrderStatusId() == null) {
			missingFields.add("orderStatusId");
		}
		if (orderRequest.getAccountId() == null) {
			missingFields.add("accountId");
		}
		if (orderRequest.getOrderDetails() == null) {
			missingFields.add("orderDetails");
		}

		if (!missingFields.isEmpty()) {
			String errorMessage = "Dữ liệu đầu vào không hợp lệ. Thiếu: " + String.join(", ", missingFields);
			return ResponseEntity.badRequest().body(new ApiResponse<>(false, errorMessage, null));
		}

		try {
			// 1. Tạo đơn hàng như bình thường (chưa thanh toán)
			orderRequest.setPaymentMethod("VietQR");
			orderRequest.setPaymentStatus("Chưa thanh toán");
			Order createdOrder = orderService.placeOrder(orderRequest);

			// 2. Tạo mã QR VietQR
			String bankCode = "vpbank"; // Bạn có thể cho phép người dùng chọn ngân hàng
			String accountNumber = "624032004"; // Số tài khoản nhận tiền
			String message = "Thanh toan don " + createdOrder.getOrderCode();
			String qrString = vietQRService.generateQR(bankCode, accountNumber, createdOrder.getTotalAmount(), message,
					createdOrder.getOrderCode());

			// 3. Convert QR string to base64 image (nếu muốn trả ảnh)
			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			QRCodeWriter writer = new QRCodeWriter();
			BitMatrix bitMatrix = writer.encode(qrString, BarcodeFormat.QR_CODE, 400, 400);
			BufferedImage qrImage = new BufferedImage(400, 400, BufferedImage.TYPE_INT_RGB);
			for (int x = 0; x < 400; x++) {
				for (int y = 0; y < 400; y++) {
					qrImage.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
				}
			}
			ImageIO.write(qrImage, "png", outputStream);
			String base64Qr = Base64.getEncoder().encodeToString(outputStream.toByteArray());

			// 4. Trả kết quả
			Map<String, Object> responseData = new HashMap<>();
			responseData.put("order", orderService.convertToResponse(createdOrder));
			responseData.put("qrData", qrString);
			responseData.put("qrBase64Image", "data:image/png;base64," + base64Qr);

			sendEmail.sendOrderConfirmationEmail(orderService.convertToResponse(createdOrder).getEmail(), createdOrder);
			return ResponseEntity.ok(new ApiResponse<>(true, "Tạo đơn hàng VietQR thành công", responseData));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new ApiResponse<>(false, "Lỗi hệ thống: " + e.getMessage(), null));
		}
	}

}