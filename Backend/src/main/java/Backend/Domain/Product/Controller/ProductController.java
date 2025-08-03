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
import Backend.Domain.Product.DTO.Request.ProductRequest;
import Backend.Domain.Product.DTO.Request.ProductUpdateRequest;
import Backend.Domain.Product.DTO.Response.ProductDetailResponse;
import Backend.Domain.Product.DTO.Response.ProductSimpleResponse;
import Backend.Domain.Product.Entity.Product;
import Backend.Domain.Product.Service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    // ✅ API lấy danh sách sản phẩm có phân trang
    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<PaginationResponse<ProductSimpleResponse>> getProductSummary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "productName") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Product> productPage = productService.getAllProducts(pageable);

        List<ProductSimpleResponse> productDTOs = productPage.getContent().stream()
                .map(product -> new ProductSimpleResponse(
                        product.getProductId(),
                        product.getProductName(),
                        product.getDescription(),
                        product.getBarcode(),
                        product.getBrand().getBrandName(),
                        product.getCategory().getCategoryName(),
                        product.getSupplier().getSupplierName(),
                        product.getModel(),
                        product.getWarrantyPeriod()))
                .collect(Collectors.toList());

        PaginationResponse<ProductSimpleResponse> response = new PaginationResponse<>(
                productDTOs,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/names")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<List<String>> getProductNames() {
        List<String> productNames = productService.getAllProductNames();
        return ResponseEntity.ok(productNames);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> getProductDetail(@PathVariable Integer id) {
        ProductDetailResponse response = productService.getProductDetail(id);
        return ResponseEntity.ok(response);
    }

    // ✅ API thêm mới sản phẩm
    @PostMapping("/add")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody @Valid ProductRequest request) {
        Product createdProduct = productService.createProduct(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm sản phẩm thành công!", createdProduct));
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadProductImage(
            @RequestParam Integer productId,
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam String imageType) {
        try {
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "Ảnh không được để trống!", null));
            }

            productService.uploadProductImage(productId, imageFile, imageType);
            return ResponseEntity.ok(new ApiResponse<>(true, "Upload ảnh thành công!", null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "Lỗi khi upload ảnh: " + e.getMessage(), null));
        }
    }

    // ✅ API cập nhật sản phẩm
    @PutMapping("/{productId}")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Integer productId,
            @RequestBody @Valid ProductUpdateRequest request) {

        Product updatedProduct = productService.updateProduct(productId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật sản phẩm thành công!", updatedProduct));
    }

    // ✅ API xóa sản phẩm
    @DeleteMapping("/{productId}")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Integer productId) {
        try {
            productService.deleteProduct(productId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa sản phẩm thành công", null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

}