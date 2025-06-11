package Backend.Controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import Backend.Model.ProductImage;
import Backend.Request.ProductImageRequest;
import Backend.Response.ApiResponse;
import Backend.Response.PaginationResponse;
import Backend.Response.ProductImageResponse;
import Backend.Service.ProductImageService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService productImageService;

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<PaginationResponse<ProductImageResponse>> getAllProductImages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<ProductImage> imagePage = productImageService.getAllProductImages(pageable);

        // Ánh xạ từ ProductImage sang ProductImageResponse
        List<ProductImageResponse> imageDTOs = imagePage.getContent().stream()
                .map(image -> new ProductImageResponse(
                        image.getImageId(),
                        image.getProduct().getProductId(),
                        image.getImageUrl(),
                        image.getImageType(),
                        image.getProduct().getProductName(),
                        image.getCreatedAt()))
                .collect(Collectors.toList());

        // Tạo PaginationResponse và trả về
        PaginationResponse<ProductImageResponse> response = new PaginationResponse<>(
                imageDTOs, // Danh sách ảnh sản phẩm
                imagePage.getNumber(), // Số trang hiện tại
                imagePage.getSize(), // Kích thước mỗi trang
                imagePage.getTotalElements(), // Tổng số bản ghi
                imagePage.getTotalPages() // Tổng số trang
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/product/{productId}")
    public List<ProductImageResponse> getByProductId(@PathVariable Integer productId) {
        return productImageService.getByProductId(productId);
    }

    @PutMapping("/{imageId}")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<ProductImageResponse>> updateImage(
            @PathVariable Integer imageId,
            @ModelAttribute ProductImageRequest request) {

        ProductImage updatedImage = productImageService.update(
                imageId,
                request.getLogo(),
                request.getImageType() // <-- truyền thêm imageType
        );

        ProductImageResponse responseDto = new ProductImageResponse(updatedImage);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Cập nhật thông tin thành công!", responseDto));
    }

    @PutMapping("/{imageId}/upload")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<ProductImage>> updateImage(
            @PathVariable Integer imageId,
            @RequestParam MultipartFile logo) {
        // Validate file
        if (logo != null && !logo.isEmpty()) {
            String validationMessage = validateImageFile(logo);
            if (validationMessage != null) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(false, validationMessage, null));
            }
        }

        ProductImage updatedImage = productImageService.update(imageId, logo, null);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật ảnh thành công!", updatedImage));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        productImageService.delete(id);
        ApiResponse<Void> response = new ApiResponse<>(true, "Xóa ảnh thành công!", null);
        return ResponseEntity.ok(response);
    }

    public String validateImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null ||
                !(contentType.equals("image/jpeg") || contentType.equals("image/png")
                        || contentType.equals("image/webp"))) {
            return "Chỉ hỗ trợ ảnh JPG, PNG, WEBP.";
        }

        if (file.getSize() > 2 * 1024 * 1024) {
            return "Kích thước ảnh không được vượt quá 2MB.";
        }

        return null;
    }

}
