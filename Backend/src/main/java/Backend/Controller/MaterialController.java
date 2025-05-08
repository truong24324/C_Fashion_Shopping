package Backend.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import Backend.Model.Material;
import Backend.Request.MaterialRequest;
import Backend.Response.ApiResponse;
import Backend.Service.MaterialService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {
    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    // ✅ API lấy danh sách chất liệu có phân trang
    @GetMapping("/all")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<Page<Material>> getAllMaterials(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "materialName") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Material> materialPage = materialService.getAllMaterials(pageable);
        return ResponseEntity.ok(materialPage);
    }

    // ✅ API thêm mới chất liệu
    @PostMapping("/add")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<ApiResponse<Material>> createMaterial(@RequestBody @Valid MaterialRequest request) {
        if (materialService.isMaterialNameExists(request.getMaterialName())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên chất liệu đã tồn tại!", null));
        }

        Material createdMaterial = materialService.createMaterial(request.getMaterialName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm chất liệu thành công!", createdMaterial));
    }

    // ✅ API cập nhật chất liệu
    @PutMapping("/{materialId}")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<ApiResponse<Material>> updateMaterial(
            @PathVariable Integer materialId,
            @RequestBody @Valid MaterialRequest request) {

        Material existingMaterial = materialService.getMaterialById(materialId);
        if (!existingMaterial.getMaterialName().equals(request.getMaterialName()) &&
                materialService.isMaterialNameExists(request.getMaterialName())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên chất liệu đã tồn tại!", null));
        }

        Material updatedMaterial = materialService.updateMaterial(materialId, request.getMaterialName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật chất liệu thành công!", updatedMaterial));
    }

    // ✅ API xóa chất liệu
    @DeleteMapping("/{materialId}")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<ApiResponse<String>> deleteMaterial(@PathVariable Integer materialId) {
        materialService.deleteMaterial(materialId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa chất liệu thành công", null));
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
