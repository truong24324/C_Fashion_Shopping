package Backend.Controller;

import Backend.Model.Order;
import Backend.Request.OrderStatusUpdateRequest;
import Backend.Response.ApiResponse;
import Backend.Response.OrderResponse;
import Backend.Service.OrderService;
import lombok.RequiredArgsConstructor;

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

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrdersByStatusWithPaging(
            @RequestParam(required = false) Integer statusId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<OrderResponse> orders = orderService.findByStatusWithPaging(statusId, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách đơn hàng theo trạng thái thành công", orders));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Integer orderId) {
        Order order = orderService.findById(orderId);
        OrderResponse response = orderService.toOrderResponse(order);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết đơn hàng thành công", response));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Integer orderId,
            @RequestBody OrderStatusUpdateRequest request
    ) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, request);
        OrderResponse response = orderService.toOrderResponse(updatedOrder);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật trạng thái đơn hàng thành công", response));
    }
}
