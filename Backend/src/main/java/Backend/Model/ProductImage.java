package Backend.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "PRODUCT_IMAGES")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IMAGE_ID")
    private Integer imageId;  // Mã ảnh

    @ManyToOne
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;  // Liên kết với sản phẩm

    @Column(name = "IMAGE_URL", nullable = false, length = 500)
    private String imageUrl;  // Đường dẫn ảnh

    @Enumerated(EnumType.STRING)
    @Column(name = "IMAGE_TYPE", nullable = false)
    private ImageType imageType;  // Loại ảnh (MAIN, SECONDARY, OTHER)

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();  // Thời gian tạo

}
