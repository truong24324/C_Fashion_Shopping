package Backend.Domain.Product.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import Backend.Domain.Product.Entity.Brand;
import Backend.Domain.Product.Repository.BrandRepository;
import Backend.Domain.Product.Repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BrandService {
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final Path brandUploadPath = Path.of("uploads/brands");

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(brandUploadPath); // Tạo thư mục nếu chưa có
    }

    // ✅ Lấy danh sách thương hiệu (có phân trang)
    public Page<Brand> getAllBrands(Pageable pageable) {
        return brandRepository.findAll(pageable);
    }

    // ✅ Tìm kiếm thương hiệu theo tên (có phân trang)
    public Page<Brand> searchBrands(String keyword, Pageable pageable) {
        return brandRepository.findByBrandNameContainingIgnoreCase(keyword, pageable);
    }

    public boolean isBrandNameExists(String brandName) {
        return brandRepository.existsByBrandName(brandName);
    }

    // Lấy danh sách thương hiệu
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    // Lấy thương hiệu theo ID
    public Brand getBrandById(Integer brandId) {
        return brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thương hiệu!"));
    }

    // Thêm thương hiệu với ảnh tải lên
    public Brand createBrandWithImage(String brandName, MultipartFile file) {
        String imageUrl = saveImage(file);
        Brand brand = new Brand();
        brand.setBrandName(brandName);
        brand.setLogo(imageUrl);
        return brandRepository.save(brand);
    }

    // Cập nhật thương hiệu (có thể cập nhật ảnh hoặc không)
    public Brand updateBrand(Integer brandId, String brandName, MultipartFile file) {
        Brand brand = getBrandById(brandId);
        boolean isUpdated = false;

        if (brandName != null && !brandName.trim().isEmpty()
                && !brand.getBrandName().trim().equalsIgnoreCase(brandName.trim())) {
            brand.setBrandName(brandName.trim());
            isUpdated = true;
        }

        // Cập nhật logo nếu có file mới
        if (file != null && !file.isEmpty()) {
            String imageUrl = saveImage(file);
            brand.setLogo(imageUrl);
            isUpdated = true;
        }

        // Nếu không có gì thay đổi thì trả về như cũ
        if (!isUpdated) {
			return brand;
		}

        return brandRepository.save(brand);
    }

    // Xóa thương hiệu
    public void deleteBrand(Integer brandId) {
        // Kiểm tra xem thương hiệu có đang được sử dụng trong sản phẩm không
        if (productRepository.existsByBrand_BrandId(brandId)) {
            // Trả về thông báo lỗi nếu thương hiệu đang được sử dụng
            throw new IllegalStateException("Thương hiệu này đang được sử dụng trong các sản phẩm khác, không thể xóa.");
        }

        // Nếu không sử dụng, tiếp tục xóa
        Brand brand = getBrandById(brandId);
        brandRepository.delete(brand);
    }

    private String saveImage(MultipartFile file) {
        try {
        	Path uploadDir = Path.of("uploads/brands");
        	if (!Files.exists(uploadDir)) {
        	    Files.createDirectories(uploadDir);
        	}

            String fileName = "Brand_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = brandUploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imagePath = "uploads/brands/" + fileName; // Không có dấu `/` ở đầu
            return imagePath; // Đảm bảo khi lưu vào DB là đúng đường dẫn thư mục
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu ảnh thương hiệu!", e);
        }
    }

}
