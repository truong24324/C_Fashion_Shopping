package Backend.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import Backend.Model.Discount;
import Backend.Request.DiscountRequest;
import Backend.Request.DiscountUpdateRequest;
import Backend.Response.ApiResponse;
import Backend.Response.DiscountPublicResponse;
import Backend.Response.DiscountResponse;
import Backend.Service.DiscountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
public class DiscountController {

	private final DiscountService discountService;


	// ✅ API lấy danh sách mã giảm giá (phân trang + sắp xếp)
	@GetMapping("/all")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
	public ResponseEntity<Page<DiscountResponse>> getAllDiscounts(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "createdAt") String sortBy) {

		Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
		Page<DiscountResponse> discountPage = discountService.getAllDiscounts(pageable);
		return ResponseEntity.ok(discountPage);
	}

	// ✅ API hiển thị danh sách mã giảm giá cho người dùng (chỉ mã và mô tả)
	@PreAuthorize("hasAnyAuthority('ROLE_Customer')")
	@GetMapping("/public")
	public ResponseEntity<List<DiscountPublicResponse>> getPublicDiscounts() {
	    List<DiscountResponse> discounts = discountService.getPublicDiscounts();

	    List<DiscountPublicResponse> publicDiscounts = discounts.stream().map(discount -> {
	        DiscountPublicResponse res = new DiscountPublicResponse();
	        res.setDiscountCode(discount.getDiscountCode());
	        res.setDescription(discount.getDescription());
	        return res;
	    }).collect(Collectors.toList());

	    return ResponseEntity.ok(publicDiscounts);
	}

	// ✅ API thêm mã giảm giá
	@PostMapping("/add")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
	public ResponseEntity<ApiResponse<Discount>> createDiscount(@RequestBody @Valid DiscountRequest request) {
		if (discountService.isDiscountCodeExists(request.getDiscountCode())) {
			return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Mã giảm giá đã tồn tại!", null));
		}

		Discount created = discountService.createDiscount(request);
		return ResponseEntity.ok(new ApiResponse<>(true, "Thêm mã giảm giá thành công!", created));
	}

	// ✅ API cập nhật mã giảm giá
	@PutMapping("/{discountId}")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
	public ResponseEntity<ApiResponse<Discount>> updateDiscount(
	        @PathVariable Integer discountId,
	        @RequestBody @Valid DiscountUpdateRequest request) {

	    request.sanitizeDiscountValue(); // <--- Làm sạch dữ liệu ở đây

	    Discount updated = discountService.updateDiscount(discountId, request);
	    return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật mã giảm giá thành công!", updated));
	}

	@PatchMapping("/{discountId}/status")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
	public ResponseEntity<ApiResponse<String>> updateDiscountStatus(@PathVariable Integer discountId,
			@RequestParam boolean isActive) {

		discountService.updateDiscountStatus(discountId, isActive);
		return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật trạng thái thành công!", null));
	}

	// ✅ API xóa mã giảm giá
	@DeleteMapping("/{discountId}")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
	public ResponseEntity<ApiResponse<String>> deleteDiscount(@PathVariable Integer discountId) {
		discountService.deleteDiscount(discountId);
		return ResponseEntity.ok(new ApiResponse<>(true, "Xóa mã giảm giá thành công", null));
	}

}
