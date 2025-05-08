package Backend.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import Backend.Model.ImageType;
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
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager')")
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
                        image.getProduct().getProductName()
                ))
                .collect(Collectors.toList());

        // Tạo PaginationResponse và trả về
        PaginationResponse<ProductImageResponse> response = new PaginationResponse<>(
                imageDTOs,  // Danh sách ảnh sản phẩm
                imagePage.getNumber(),   // Số trang hiện tại
                imagePage.getSize(),     // Kích thước mỗi trang
                imagePage.getTotalElements(), // Tổng số bản ghi
                imagePage.getTotalPages() // Tổng số trang
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/product/{productId}")
    public List<ProductImageResponse> getByProductId(@PathVariable Integer productId) {
        return productImageService.getByProductId(productId);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager')")
    @PutMapping("/{imageId}")
    public ResponseEntity<ApiResponse<ProductImage>> updateImage(
            @PathVariable Integer imageId,
            @RequestPart("imageId") Integer imageIdFromForm,
            @RequestPart("productId") Integer productId,
            @ModelAttribute  ProductImageRequest request) {

        // Lấy ảnh hiện tại
        ProductImage existingImage = productImageService.getById(imageId);

        // Kiểm tra và validate tên mới (nếu có)
        String newImageUrl = request.getImageFile() != null ? request.getImageFile().getOriginalFilename() : null; // Nếu có file ảnh mới, lấy tên file
        if (newImageUrl != null && !newImageUrl.trim().isEmpty() &&
                !existingImage.getImageUrl().equals(newImageUrl) &&
                productImageService.isImageUrlExists(newImageUrl)) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "URL ảnh đã tồn tại!", null));
        }

        // Cập nhật thông tin ảnh
        ProductImage updatedImage = productImageService.update(imageId, request.getProductId(),
                                                                request.getImageType(), request.getImageFile());
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật ảnh thành công!", updatedImage));
    }

    @PutMapping("/{imageId}/upload")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager')")
    public ResponseEntity<ApiResponse<ProductImage>> updateImage(
            @PathVariable Integer imageId,
            @ModelAttribute("productId")  Integer productId,
            @ModelAttribute("imageType") ImageType imageType,
            @RequestParam("imageUrl") MultipartFile imageFile) {

        // Validate file
        if (imageFile != null && !imageFile.isEmpty()) {
            String validationMessage = validateImageFile(imageFile);
            if (validationMessage != null) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(false, validationMessage, null));
            }
        }

        ProductImage updatedImage = productImageService.update(imageId, productId, imageType, imageFile);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật ảnh thành công!", updatedImage));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        productImageService.delete(id);
    }

    public String validateImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null ||
            !(contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("image/webp"))) {
            return "Chỉ hỗ trợ ảnh JPG, PNG, WEBP.";
        }

        if (file.getSize() > 2 * 1024 * 1024) {
            return "Kích thước ảnh không được vượt quá 2MB.";
        }

        return null;
    }

}
