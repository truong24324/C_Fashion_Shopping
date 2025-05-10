package Backend.Service;

import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import Backend.Model.Category;
import Backend.Repository.CategoryRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // ✅ Lấy danh sách danh mục có phân trang
    public Page<Category> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    // ✅ Tìm kiếm danh mục theo tên
    public Page<Category> searchCategories(String keyword, Pageable pageable) {
        return categoryRepository.findByCategoryNameContainingIgnoreCase(keyword, pageable);
    }

    // ✅ Kiểm tra danh mục có tồn tại không
    public boolean isCategoryNameExists(String categoryName) {
        return categoryRepository.existsByCategoryName(categoryName);
    }

    // ✅ Lấy danh mục theo ID
    public Category getCategoryById(Integer categoryId) {
        return categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục!"));
    }

    // ✅ Thêm danh mục mới
    public Category createCategory(String categoryName, String description) {
        Category category = new Category();
        category.setCategoryName(categoryName);
        category.setDescription(description);
        return categoryRepository.save(category);
    }

    // ✅ Cập nhật danh mục
    public Category updateCategory(Integer categoryId, String categoryName, String description) {
        Category category = getCategoryById(categoryId);
        boolean isUpdated = false;

        // Cập nhật tên nếu khác và không rỗng
        if (categoryName != null && !categoryName.trim().isEmpty()
                && !category.getCategoryName().equals(categoryName.trim())) {
            category.setCategoryName(categoryName.trim());
            isUpdated = true;
        }

        // Cập nhật mô tả nếu khác và không rỗng
        if (description != null && !description.trim().isEmpty()
                && !Objects.equals(category.getDescription(), description.trim())) {
            category.setDescription(description.trim());
            isUpdated = true;
        }

        // Nếu không thay đổi gì thì trả về nguyên bản
        if (!isUpdated) {
			return category;
		}

        return categoryRepository.save(category);
    }

    // ✅ Xóa danh mục
    public void deleteCategory(Integer categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}
