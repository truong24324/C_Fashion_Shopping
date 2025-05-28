package Backend.Controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Backend.Model.Category;
import Backend.Request.CategoryRequest;
import Backend.Response.ApiResponse;
import Backend.Response.PaginationResponse;
import Backend.Service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // ✅ API lấy danh sách danh mục có phân trang
    @GetMapping("/all")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<PaginationResponse<Category>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "categoryName") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Category> categoryPage = categoryService.getAllCategories(pageable);

        PaginationResponse<Category> response = new PaginationResponse<>(
                categoryPage.getContent(),
                categoryPage.getNumber(),
                categoryPage.getSize(),
                categoryPage.getTotalElements(),
                categoryPage.getTotalPages()
        );

        return ResponseEntity.ok(response);
    }

    // ✅ API thêm mới danh mục
    @PostMapping("/add")
	@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody @Valid CategoryRequest request) {

        // 🛑 Kiểm tra tên có bị trùng không
        if (categoryService.isCategoryNameExists(request.getCategoryName())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên danh mục đã tồn tại!", null));
        }

        Category createdCategory = categoryService.createCategory(request.getCategoryName(), request.getDescription());
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm danh mục thành công!", createdCategory));
    }

    // ✅ API cập nhật danh mục
    @PutMapping("/{categoryId}")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable Integer categoryId,
            @RequestBody CategoryRequest request) {

        Category existingCategory = categoryService.getCategoryById(categoryId);

        // Xử lý tên danh mục (nếu có nhập và thay đổi)
        String newName = request.getCategoryName();
        if (newName != null && !newName.trim().isEmpty()
                && !newName.equals(existingCategory.getCategoryName())
                && categoryService.isCategoryNameExists(newName)) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên danh mục đã tồn tại!", null));
        }

        Category updatedCategory = categoryService.updateCategory(
                categoryId,
                newName,
                request.getDescription()
        );

        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật danh mục thành công!", updatedCategory));
    }

    // ✅ API xóa danh mục
    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Integer categoryId) {
        try {
            categoryService.deleteCategory(categoryId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa danh mục thành công", null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

}
