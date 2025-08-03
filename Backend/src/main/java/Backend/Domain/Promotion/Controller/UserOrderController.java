package Backend.Domain.Promotion.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import Backend.Domain.Accounts.DTO.Response.ApiResponse;
import Backend.Domain.Accounts.Entity.Account;
import Backend.Domain.Order.DTO.Response.OrderDetailResponse;
import Backend.Domain.Order.DTO.Response.OrderResponse;
import Backend.Domain.Order.Entity.Order;
import Backend.Domain.Order.Entity.OrderDetail;
import Backend.Domain.Order.Service.OrderService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user/orders")
@PreAuthorize("hasAuthority('ROLE_Customer')")
@RequiredArgsConstructor
public class UserOrderController {

	private final OrderService orderService;

	// API cho người dùng cập nhật trạng thái đơn hàng
	@PatchMapping("/{orderId}/status")
	public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatusByUser(@PathVariable Integer orderId,
			@RequestParam String targetStatusName, @AuthenticationPrincipal Account userAccount) {

		Order updatedOrder = orderService.updateStatusByUser(orderId, userAccount.getAccountId(), targetStatusName);
		return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật trạng thái đơn hàng thành công",
				orderService.toOrderResponse(updatedOrder)));
	}

	@GetMapping("/purchased-products")
	public ResponseEntity<ApiResponse<List<OrderDetailResponse>>> getAllPurchasedProducts(
			@AuthenticationPrincipal Account userAccount) {

		List<OrderDetail> orderDetails = orderService.getAllPurchasedProductsByAccount(userAccount.getAccountId());

		List<OrderDetailResponse> response = orderDetails.stream().map(orderService::toOrderDetailResponse)
				.collect(Collectors.toList());

		return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách sản phẩm đã mua thành công", response));
	}

}
