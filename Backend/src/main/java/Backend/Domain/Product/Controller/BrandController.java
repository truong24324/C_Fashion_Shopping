package Backend.Domain.Product.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import Backend.Domain.Accounts.DTO.Response.ApiResponse;
import Backend.Domain.Accounts.DTO.Response.PaginationResponse;
import Backend.Domain.Product.DTO.Request.BrandRequest;
import Backend.Domain.Product.DTO.Response.BrandResponse;
import Backend.Domain.Product.Entity.Brand;
import Backend.Domain.Product.Service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/brands")
public class BrandController {
    private final BrandService brandService;

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<PaginationResponse<BrandResponse>> getAllBrands(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "brandName") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Brand> brandPage = brandService.getAllBrands(pageable);

        // Ánh xạ từ Brand sang BrandResponse
        List<BrandResponse> brandDTOs = brandPage.getContent().stream()
                .map(brand -> new BrandResponse(
                        brand.getBrandId(),
                        brand.getBrandName(),
                        brand.getLogo()
                ))
                .collect(Collectors.toList());

        // Tạo PaginationResponse và trả về
        PaginationResponse<BrandResponse> response = new PaginationResponse<>(
                brandDTOs,  // Danh sách thương hiệu
                brandPage.getNumber(),   // Số trang hiện tại
                brandPage.getSize(),     // Kích thước mỗi trang
                brandPage.getTotalElements(), // Tổng số bản ghi
                brandPage.getTotalPages() // Tổng số trang
        );

        return ResponseEntity.ok(response);
    }

    // ✅ API thêm mới thương hiệu (dùng @Valid để bắt lỗi tự động)
    @PostMapping("/add")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Brand>> createBrand(@ModelAttribute @Valid BrandRequest request) {

        // 🛑 Kiểm tra tên có bị trùng không
        if (brandService.isBrandNameExists(request.getBrandName())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên thương hiệu đã tồn tại!", null));
        }

        // 🛑 Kiểm tra file ảnh
        String validationMessage = validateImageFile(request.getFile());
        if (validationMessage != null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, validationMessage, null));
        }

        Brand createdBrand = brandService.createBrandWithImage(request.getBrandName(), request.getFile());
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm thương hiệu thành công!", createdBrand));
    }

    @PutMapping("/{brandId}")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Brand>> updateBrand(
            @PathVariable Integer brandId,
            @RequestBody  BrandRequest request) {

        Brand existingBrand = brandService.getBrandById(brandId);

        // Kiểm tra tên bị trùng (nếu có nhập)
        String newName = request.getBrandName();
        if (newName != null && !newName.trim().isEmpty()
                && !existingBrand.getBrandName().equals(newName)
                && brandService.isBrandNameExists(newName)) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên thương hiệu đã tồn tại!", null));
        }

        Brand updatedBrand = brandService.updateBrand(brandId, newName, request.getFile());
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật thương hiệu thành công!", updatedBrand));
    }

    // ✅ API cập nhật ảnh thương hiệu
    @PutMapping("/{brandId}/upload")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Brand>> updateBrand(
            @PathVariable Integer brandId,
            @ModelAttribute BrandRequest request,
            @RequestParam MultipartFile logo) {

        Brand existingBrand = brandService.getBrandById(brandId);

        // Kiểm tra tên bị trùng (nếu có nhập)
        String newName = request.getBrandName();
        if (newName != null && !newName.trim().isEmpty()
                && !existingBrand.getBrandName().equals(newName)
                && brandService.isBrandNameExists(newName)) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên thương hiệu đã tồn tại!", null));
        }

        // Kiểm tra file ảnh (nếu có)
        if (!logo.isEmpty()) {
            String validationMessage = validateImageFile(logo);
            if (validationMessage != null) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(false, validationMessage, null));
            }
        }

        Brand updatedBrand = brandService.updateBrand(brandId, newName, logo);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật thương hiệu thành công!", updatedBrand));
    }

    // ✅ API xóa thương hiệu
    @DeleteMapping("/{brandId}")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<String>> deleteBrand(@PathVariable Integer brandId) {
        try {
            brandService.deleteBrand(brandId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa thương hiệu thành công", null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // ✅ Kiểm tra file ảnh hợp lệ
    private String validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            return "Ảnh không được để trống!";
        }

        List<String> allowedTypes = List.of("image/jpeg", "image/png", "image/webp");

        if (!allowedTypes.contains(file.getContentType())) {
            return "Ảnh phải có định dạng .jpg, .jpeg, .png hoặc .webp!";
        }

        long maxSize = 10 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            return "Dung lượng ảnh không được vượt quá 10MB!";
        }

        return null;
    }
}

