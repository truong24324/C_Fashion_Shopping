package Backend.Controller;

import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import Backend.Model.Color;
import Backend.Request.ColorRequest;
import Backend.Request.ColorUpdateRequest;
import Backend.Response.ApiResponse;
import Backend.Service.ColorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/colors")
@RequiredArgsConstructor
public class ColorController {
    private final ColorService colorService;

    // ✅ API lấy danh sách màu có phân trang
    @GetMapping("/all")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<Page<Color>> getAllColors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "colorName") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Color> colorPage = colorService.getAllColors(pageable);
        return ResponseEntity.ok(colorPage);
    }

    // ✅ API tìm kiếm màu theo tên (có phân trang)
    @GetMapping("/search")
    public ResponseEntity<Page<Color>> searchColors(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Color> colorPage = colorService.searchColors(keyword, pageable);
        return ResponseEntity.ok(colorPage);
    }

    // ✅ API thêm mới màu
    @PostMapping("/add")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Color>> createColor(@RequestBody @Valid ColorRequest request) {
        if (colorService.isColorNameExists(request.getColorName())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên màu đã tồn tại!", null));
        }

        Color createdColor = colorService.createColor(request.getColorName(), request.getColorCode());
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm màu thành công!", createdColor));
    }

    // ✅ API cập nhật màu
    @PutMapping("/{colorId}")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Color>> updateColor(
            @PathVariable Integer colorId,
            @RequestBody ColorUpdateRequest request) {

        try {
            Color updatedColor = colorService.updateColor(colorId, request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật màu thành công!", updatedColor));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, ex.getMessage(), null));
        }
    }

    // ✅ API xóa màu
    @DeleteMapping("/{colorId}")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<String>> deleteColor(@PathVariable Integer colorId) {
        colorService.deleteColor(colorId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa màu thành công", null));
    }
}
