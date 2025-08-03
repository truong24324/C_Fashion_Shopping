package Backend.Domain.Product.Controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import Backend.Domain.Accounts.DTO.Response.ApiResponse;
import Backend.Domain.Accounts.DTO.Response.PaginationResponse;
import Backend.Domain.Product.DTO.Request.SupplierRequest;
import Backend.Domain.Product.Entity.Supplier;
import Backend.Domain.Product.Service.SupplierService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/suppliers")
public class SupplierController {
    private final SupplierService supplierService;

    // ✅ API lấy danh sách nhà cung cấp có phân trang
    @GetMapping("/all")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<PaginationResponse<Supplier>> getAllSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "supplierName") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Supplier> supplierPage = supplierService.getAllSuppliers(pageable);

        PaginationResponse<Supplier> response = new PaginationResponse<>(
                supplierPage.getContent(),
                supplierPage.getNumber(),
                supplierPage.getSize(),
                supplierPage.getTotalElements(),
                supplierPage.getTotalPages()
        );

        return ResponseEntity.ok(response);
    }

 // ✅ API lấy danh sách tên nhà cung cấp
    @GetMapping("/names")
    public ResponseEntity<PaginationResponse<String>> getSupplierNames(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<String> supplierNames = supplierService.getSupplierNames(pageable);

        PaginationResponse<String> response = new PaginationResponse<>(
                supplierNames.getContent(),
                supplierNames.getNumber(),
                supplierNames.getSize(),
                supplierNames.getTotalElements(),
                supplierNames.getTotalPages()
        );

        return ResponseEntity.ok(response);
    }

    // ✅ API thêm mới nhà cung cấp
    @PostMapping("/add")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Supplier>> createSupplier(@RequestBody @Valid SupplierRequest request) {
        Supplier createdSupplier = supplierService.createSupplier(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm nhà cung cấp thành công!", createdSupplier));
    }

    // ✅ API cập nhật nhà cung cấp
    @PutMapping("/{supplierId}")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Supplier>> updateSupplier(
            @PathVariable Integer supplierId,
            @RequestBody @Valid SupplierRequest request) {
        Supplier updatedSupplier = supplierService.updateSupplier(supplierId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật nhà cung cấp thành công!", updatedSupplier));
    }

    @DeleteMapping("/{supplierId}")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<String>> deleteSupplier(@PathVariable Integer supplierId) {
        try {
            // Gọi service để xóa nhà cung cấp
            supplierService.deleteSupplier(supplierId);

            // Trả về phản hồi thành công
            return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa nhà cung cấp thành công", null));
        } catch (EntityNotFoundException e) {
            // Trường hợp nhà cung cấp không tồn tại
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Nhà cung cấp không tồn tại", null));
        } catch (IllegalStateException e) {
            // Trường hợp nhà cung cấp đang được sử dụng và không thể xóa
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác (nếu có)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Có lỗi xảy ra trong quá trình xử lý", null));
        }
    }

}
