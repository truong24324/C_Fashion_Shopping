package Backend.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Backend.Model.Account;
import Backend.Model.Order;
import Backend.Model.OrderDetail;
import Backend.Response.ApiResponse;
import Backend.Response.OrderDetailResponse;
import Backend.Response.OrderResponse;
import Backend.Service.OrderService;
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
