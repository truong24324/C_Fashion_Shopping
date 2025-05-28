package Backend.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
import Backend.Service.EmailService;
import Backend.Service.MoMoService;
import Backend.Service.OrderService;
import Backend.Service.VNPayService;
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
	private final EmailService emailService;
	private final OrderService orderService;
	private final OrderRepository orderRepository;
	private final OrderDetailRepository orderDetailRepository;
	private final OrderStatusRepository orderStatusRepository;
	private final VariantRepository variantRepository;

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

//	@PostMapping("/ipn-handler")
//	public ResponseEntity<String> handleMomoCallback(@RequestBody Map<String, String> momoResponse) {
//		try {
//			System.out.println("📩 Đã nhận IPN từ MoMo: " + momoResponse); // In toàn bộ JSON
//
//			String resultCode = momoResponse.get("resultCode");
//			String orderId = momoResponse.get("orderId");
//
//			Optional<Order> optionalOrder = orderRepository.findByOrderCode(orderId);
//			if (optionalOrder.isEmpty()) {
//				return ResponseEntity.badRequest().body("Không tìm thấy đơn hàng với mã: " + orderId);
//			}
//
//			Order order = optionalOrder.get();
//			System.out
//					.println("✅ Đã tìm thấy đơn hàng. Trạng thái hiện tại: " + order.getOrderStatus().getStatusName());
//
//			// Lấy status id hiện tại
//			Integer currentStatusId = order.getOrderStatus().getStatusId();
//
//			// Xử lý kết quả thanh toán
//			if ("0".equals(resultCode)) {
//				if (!currentStatusId.equals(1)) {
//					OrderStatus paidStatus = orderStatusRepository.findById(1)
//							.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy trạng thái PAID"));
//
//					order.setOrderStatus(paidStatus);
//					orderRepository.save(order);
//
//					System.out.println("🎉 Thanh toán thành công. Đã cập nhật trạng thái đơn hàng.");
//				}
//
//				sendOrderConfirmationEmail(order.getAccount().getEmail(), order);
//				return ResponseEntity.ok("Payment success");
//			} else {
//				if (!currentStatusId.equals(1)) {
//					OrderStatus pendingStatus = orderStatusRepository.findById(0)
//							.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy trạng thái PENDING"));
//
//					order.setOrderStatus(pendingStatus);
//					orderRepository.save(order);
//
//					System.out.println("🔄 Đặt lại trạng thái đơn hàng về CHỜ (PENDING)");
//				}
//				return ResponseEntity.status(400).body("Payment failed");
//			}
//
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(500).body("Lỗi xử lý IPN MoMo");
//		}
//	}

	@PostMapping("/momo/ipn")
	@Transactional
	public ResponseEntity<String> handleMomoIpn(@RequestBody Map<String, Object> payload) {
	    try {
	        String orderId = (String) payload.get("orderId");
	        String resultCode = String.valueOf(payload.get("resultCode"));

	        if (!"0".equals(resultCode)) {
	            return ResponseEntity.ok("MoMo báo thanh toán thất bại");
	        }

	        Order order = orderRepository.findByOrderCode(orderId)
	            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

	        if ("Đã thanh toán".equals(order.getPaymentStatus())) {
	            return ResponseEntity.ok("Đã xử lý trước đó");
	        }

	        // ✅ Cập nhật trạng thái thanh toán
	        order.setPaymentStatus("Đã thanh toán");

	        // ✅ Cập nhật trạng thái đơn hàng (ví dụ: "Đang xử lý")
	        OrderStatus processingStatus = orderStatusRepository.findByStepOrder(2)
	                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái xử lý"));
	        order.setOrderStatus(processingStatus);

	        // ✅ Giảm tồn kho
	        List<OrderDetail> details = orderDetailRepository.findByOrder(order);
	        for (OrderDetail detail : details) {
	            Variant variant = detail.getVariant();
	            if (variant.getStock() < detail.getQuantity()) {
	                throw new RuntimeException("Sản phẩm " + variant.getVariantId() + " không đủ tồn kho");
	            }
	            variant.setStock(variant.getStock() - detail.getQuantity());
	            variantRepository.save(variant);
	        }

	        orderRepository.save(order);
	        return ResponseEntity.ok("Thanh toán thành công");

	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi xử lý IPN: " + e.getMessage());
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
			sendOrderConfirmationEmail(null, createdOrder);
	        return ResponseEntity.ok(new ApiResponse<>(true, "Đặt hàng thành công", orderResponse));
	    } catch (IllegalArgumentException e) {
	        return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
	    } catch (Exception e) {
	        return ResponseEntity.status(500).body(new ApiResponse<>(false, "Lỗi hệ thống khi tạo đơn hàng: " + e.getMessage(), null));
	    }
	}

	private void sendOrderConfirmationEmail(String toEmail, Order order) {
		String subject = "Xác nhận đơn hàng #" + order.getOrderId();
		StringBuilder body = new StringBuilder();

		body.append("<h2>Cảm ơn bạn đã đặt hàng!</h2>");
		body.append("<p>Đơn hàng của bạn đã được xác nhận với thông tin sau:</p>");
		body.append("<ul>");
		body.append("<li><strong>Mã đơn hàng:</strong> " + order.getOrderId() + "</li>");
		body.append("<li><strong>Địa chỉ:</strong> " + order.getShippingAddress() + "</li>");
		body.append("<li><strong>Tổng tiền:</strong> " + order.getTotalAmount() + " VND</li>");
		body.append("<li><strong>Phí vận chuyển:</strong> " + order.getShippingFee() + " VND</li>");
		body.append("</ul>");
		body.append("<h3>Chi tiết sản phẩm:</h3>");
		body.append("<ul>");

		for (OrderDetail orderDetail : order.getOrderDetails()) {
			body.append("<li>").append(orderDetail.getVariant().getProduct().getProductName()).append(" - Số lượng: ")
					.append(orderDetail.getQuantity()).append(" - Màu sắc: ")
					.append(orderDetail.getVariant().getColor());
		}
		body.append("</ul>");
		body.append("<p><strong>Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</strong></p>");

		emailService.sendOrderConfirmation(toEmail, subject, body.toString());
	}

}
