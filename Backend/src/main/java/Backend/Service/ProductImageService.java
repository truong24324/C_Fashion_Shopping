package Backend.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import Backend.Model.ImageType;
import Backend.Model.ProductImage;
import Backend.Repository.ProductImageRepository;
import Backend.Response.ProductImageResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductImageService {

    private final ProductImageRepository imageRepository;
    private final Path productUploadPath = Path.of("uploads/products");

    public Page<ProductImage> getAllProductImages(Pageable pageable) {
        return imageRepository.findAll(pageable);
    }

    public List<ProductImageResponse> getByProductId(Integer productId) {
        return imageRepository.findByProduct_ProductId(productId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductImage update(Integer id, MultipartFile newImage) {
        return update(id, newImage, null);
    }

    public ProductImage update(Integer id, MultipartFile newImage, ImageType imageType) {
        ProductImage image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ảnh!"));

        if (newImage != null && !newImage.isEmpty()) {
            String newImageUrl = saveImage(newImage);
            image.setImageUrl(newImageUrl);
        }

        if (imageType != null) {
            image.setImageType(imageType);
        }

        return imageRepository.save(image);
    }

    public boolean isImageUrlExists(String imageUrl) {
        return imageRepository.existsByImageUrl(imageUrl);
    }

    @Transactional
    public void delete(Integer id) {
        imageRepository.deleteById(id);
    }

    private ProductImageResponse toResponse(ProductImage img) {
        // Tạo đối tượng ProductImageResponse
        ProductImageResponse res = new ProductImageResponse();

        // Thiết lập các trường từ ProductImage
        res.setImageId(img.getImageId());
        res.setProductId(img.getProduct().getProductId());
        res.setImageUrl(img.getImageUrl());
        res.setImageType(img.getImageType());

        // Thiết lập tên sản phẩm từ Product liên kết
        res.setProductName(img.getProduct().getProductName());

        return res;
    }

    public ProductImage getById(Integer imageId) {
        return imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ảnh với ID: " + imageId));
    }

    private String saveImage(MultipartFile file) {
        try {
            Path uploadDir = Path.of("uploads/products");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String fileName = "Product_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = productUploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imagePath = "uploads/products/" + fileName; // Không có dấu `/` ở đầu
            return imagePath; // Đảm bảo khi lưu vào DB là đúng đường dẫn thư mục
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu ảnh sản phẩm!", e);
        }
    }
}
