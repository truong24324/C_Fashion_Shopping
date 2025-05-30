package Backend.Controller;

import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import Backend.Model.ProductStatus;
import Backend.Request.ProductStatusRequest;
import Backend.Response.ApiResponse;
import Backend.Response.PaginationResponse;
import Backend.Service.ProductStatusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/product-status")
public class ProductStatusController {

    private final ProductStatusService productStatusService;

    // ✅ Lấy danh sách trạng thái sản phẩm có phân trang
    @GetMapping("/all")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<PaginationResponse<ProductStatus>> getAllProductStatuses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "statusName") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<ProductStatus> statusPage = productStatusService.getAllProductStatuses(pageable);

        PaginationResponse<ProductStatus> response = new PaginationResponse<>(
                statusPage.getContent(),
                statusPage.getNumber(),
                statusPage.getSize(),
                statusPage.getTotalElements(),
                statusPage.getTotalPages()
        );
        return ResponseEntity.ok(response);
    }

    // ✅ Thêm mới trạng thái sản phẩm
    @PostMapping("/add")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<ProductStatus>> createProductStatus(@RequestBody @Valid ProductStatusRequest request) {
        ProductStatus createdStatus = productStatusService.createProductStatus(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm trạng thái sản phẩm thành công!", createdStatus));
    }

    // ✅ Cập nhật trạng thái sản phẩm
    @PutMapping("/{statusId}")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<ProductStatus>> updateProductStatus(
            @PathVariable Integer statusId,
            @RequestBody @Valid ProductStatusRequest request) {
        ProductStatus updatedStatus = productStatusService.updateProductStatus(statusId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật trạng thái sản phẩm thành công!", updatedStatus));
    }

    // ✅ Xóa trạng thái sản phẩm
    @DeleteMapping("/{statusId}")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<String>> deleteProductStatus(@PathVariable Integer statusId) {
        productStatusService.deleteProductStatus(statusId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa trạng thái sản phẩm thành công", null));
    }

}
