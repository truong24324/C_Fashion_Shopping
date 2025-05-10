package Backend.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import Backend.Model.Size;
import Backend.Request.SizeRequest;
import Backend.Response.ApiResponse;
import Backend.Response.PaginationResponse;
import Backend.Service.BrandService;
import Backend.Service.ProductService;
import Backend.Service.SizeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sizes")
public class SizeController {
    private final SizeService sizeService;

    // ✅ API lấy danh sách kích thước có phân trang
    @GetMapping("/all")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<PaginationResponse<Size>> getAllSizes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "sizeName") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Size> sizePage = sizeService.getAllSizes(pageable);

        PaginationResponse<Size> response = new PaginationResponse<>(
                sizePage.getContent(),
                sizePage.getNumber(),
                sizePage.getSize(),
                sizePage.getTotalElements(),
                sizePage.getTotalPages()
        );

        return ResponseEntity.ok(response);
    }

    // ✅ API tìm kiếm kích thước theo tên (có phân trang)
    @GetMapping("/search")
    public ResponseEntity<PaginationResponse<Size>> searchSizes(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Size> sizePage = sizeService.searchSizes(keyword, pageable);

        PaginationResponse<Size> response = new PaginationResponse<>(
                sizePage.getContent(),
                sizePage.getNumber(),
                sizePage.getSize(),
                sizePage.getTotalElements(),
                sizePage.getTotalPages()
        );

        return ResponseEntity.ok(response);
    }

    // ✅ API thêm mới kích thước
    @PostMapping("/add")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<ApiResponse<Size>> createSize(@RequestBody @Valid SizeRequest request) {
        if (sizeService.isSizeNameExists(request.getSizeName())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên kích thước đã tồn tại!", null));
        }

        Size createdSize = sizeService.createSize(request.getSizeName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm kích thước thành công!", createdSize));
    }

    // ✅ API cập nhật kích thước
    @PutMapping("/{sizeId}")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<ApiResponse<Size>> updateSize(
            @PathVariable Integer sizeId,
            @RequestBody @Valid SizeRequest request) {

        Size existingSize = sizeService.getSizeById(sizeId);
        if (!existingSize.getSizeName().equals(request.getSizeName()) &&
                sizeService.isSizeNameExists(request.getSizeName())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên kích thước đã tồn tại!", null));
        }

        Size updatedSize = sizeService.updateSize(sizeId, request.getSizeName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật kích thước thành công!", updatedSize));
    }

    // ✅ API xóa kích thước
    @DeleteMapping("/{sizeId}")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<ApiResponse<String>> deleteSize(@PathVariable Integer sizeId) {
        sizeService.deleteSize(sizeId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa kích thước thành công", null));
    }

    // ✅ Bắt lỗi validate từ @Valid và trả về phản hồi chuẩn JSON
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.toList());

        String errorMessage = String.join(", ", errors);
        return ResponseEntity.badRequest().body(new ApiResponse<>(false, errorMessage, null));
    }
}
