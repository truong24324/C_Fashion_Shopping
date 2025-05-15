package Backend.Controller;

import Backend.Model.Order;
import Backend.Model.OrderStatus;
import Backend.Request.OrderStatusUpdateRequest;
import Backend.Response.ApiResponse;
import Backend.Response.OrderResponse;
import Backend.Service.OrderService;
import Backend.Service.OrderStatusService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
@RequiredArgsConstructor
public class OrderController {

	private final OrderService orderService;
	private final OrderStatusService orderStatusService;

	@GetMapping("/filter")
	public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrdersByStatusWithPaging(
			@RequestParam(required = false) Integer statusId, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Page<OrderResponse> orders = orderService.findByStatusWithPaging(statusId, page, size);
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
	    return ResponseEntity.ok(new ApiResponse<>(true, "Hủy đơn hàng thành công", orderService.toOrderResponse(updatedOrder)));
	}

}
