package Backend.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import Backend.Model.Variant;
import Backend.Request.VariantRequest;
import Backend.Response.ApiResponse;
import Backend.Response.PaginationResponse;
import Backend.Response.VariantResponse;
import Backend.Service.BrandService;
import Backend.Service.ProductService;
import Backend.Service.VariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/variants")
public class VariantController {
    private final VariantService variantService;
    
    @GetMapping("/all")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<PaginationResponse<VariantResponse>> getAllVariants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Variant> variantPage = variantService.getAllVariants(pageable);

        List<VariantResponse> variantDTOs = variantPage.getContent().stream().map(variant ->
                new VariantResponse(
                        variant.getVariantId(),
                        variant.getProduct()!= null ? variant.getProduct().getProductId() : null,
                        variant.getProduct()!= null ? variant.getProduct().getProductName() : null,
                        variant.getColor() != null ? variant.getColor().getColorName() : null,
                        variant.getSize() != null ? variant.getSize().getSizeName() : null,
                        variant.getMaterial() != null ? variant.getMaterial().getMaterialName() : null,
                        variant.getStock(),
                        variant.getPrice()
                )).collect(Collectors.toList());

        PaginationResponse<VariantResponse> response = new PaginationResponse<>(
                variantDTOs,
                variantPage.getNumber(),
                variantPage.getSize(),
                variantPage.getTotalElements(),
                variantPage.getTotalPages()
        );

        return ResponseEntity.ok(response);
    }

 // Thêm API cho phép thêm nhiều biến thể cùng lúc
    @PostMapping("/batch-add")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<List<Variant>>> createVariants(@RequestBody @Valid List<VariantRequest> requests) {
        List<Variant> createdVariants = variantService.createVariants(requests);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm variant thành công!", createdVariants));
    }

    // ✅ API cập nhật variant
    @PutMapping("/{variantId}")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Variant>> updateVariant(
            @PathVariable Integer variantId,
            @RequestBody @Valid VariantRequest request) {
        Variant updatedVariant = variantService.updateVariant(variantId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật variant thành công!", updatedVariant));
    }

    // ✅ API xóa variant
    @DeleteMapping("/{variantId}")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<String>> deleteVariant(@PathVariable Integer variantId) {
        try {
            variantService.deleteVariant(variantId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa biến thể thành công", null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(new ApiResponse<>(false, e.getMessage(), null));
        }
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
