package Backend.Domain.Order.Controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.http.HttpStatus;

import Backend.Domain.Accounts.DTO.Response.ApiResponse;
import Backend.Domain.Order.DTO.Response.OrderResponse;
import Backend.Domain.Order.Repository.OrderRepository;
import Backend.Domain.Order.Repository.OrderStatusRepository;
import Backend.Domain.Order.Service.OrderService;
import Backend.Domain.Order.Service.OrderStatusService;
import Backend.Domain.Order.Entity.Order;
import Backend.Domain.Order.Entity.OrderStatus;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
@RequiredArgsConstructor
public class OrderController {

	private final OrderService orderService;
	private final OrderRepository orderRepository;
	private final OrderStatusRepository orderStatusRepository;
	private final OrderStatusService orderStatusService;

	@GetMapping("/filter")
	public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrdersByStatusWithPaging(
			@RequestParam(required = false) Integer statusId, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "orderDate, desc") String sortBy
			) {
		Page<OrderResponse> orders = orderService.findByStatusWithPaging(statusId, page, size, sortBy);
		return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách đơn hàng theo trạng thái thành công", orders));
	}

	@GetMapping("/statuses")
	public ResponseEntity<ApiResponse<List<OrderStatus>>> getAllStatuses() {
		List<OrderStatus> statuses = orderStatusService.getAllStatuses();
		return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách trạng thái đơn hàng thành công", statuses));
	}

	@GetMapping("/{orderId}")
	public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Integer orderId) {
		Order order = orderService.findById(orderId);
		OrderResponse response = orderService.toOrderResponse(order);
		return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết đơn hàng thành công", response));
	}

	@PatchMapping("/{orderId}/next")
	public ResponseEntity<ApiResponse<OrderResponse>> updateOrderToNextStep(@PathVariable Integer orderId) {
		Order updatedOrder = orderService.updateOrderToNextStep(orderId);
		OrderResponse response = orderService.toOrderResponse(updatedOrder);
		return ResponseEntity.ok(new ApiResponse<>(true, "Chuyển sang trạng thái kế tiếp thành công", response));
	}

	@PatchMapping("/{orderId}/cancel")
	public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(@PathVariable Integer orderId) {
		Order updatedOrder = orderService.cancelOrder(orderId);
		return ResponseEntity
				.ok(new ApiResponse<>(true, "Hủy đơn hàng thành công", orderService.toOrderResponse(updatedOrder)));
	}

	@GetMapping("/momo/{orderCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_Customer')")
	public ResponseEntity<ApiResponse<OrderResponse>> getOrderByOrderCode(@PathVariable String orderCode) {
		Order order = orderService.findByOrderCode(orderCode)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng với mã: " + orderCode));

		OrderResponse response = orderService.toOrderResponse(order);
		return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết đơn hàng thành công", response));
	}

	@PutMapping("/momo/update-status/{orderCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_Customer')")
	public ResponseEntity<?> updateOrderStatusFromMomo(
			@PathVariable String orderCode,
			@RequestBody Map<String, String> updateData) {
		Order order = orderRepository.findByOrderCode(orderCode)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng!"));

		String paymentStatus = updateData.get("paymentStatus");
		String orderStatusName = updateData.get("orderStatusName");

		order.setPaymentStatus(paymentStatus);

		OrderStatus status = orderStatusRepository.findByStatusName(orderStatusName)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy trạng thái đơn hàng!"));

		order.setOrderStatus(status);
		order.setUpdatedAt(LocalDateTime.now());

		orderRepository.save(order);

		return ResponseEntity.ok(new ApiResponse<Object>(true, "Cập nhật trạng thái thành công", null));
	}

}
