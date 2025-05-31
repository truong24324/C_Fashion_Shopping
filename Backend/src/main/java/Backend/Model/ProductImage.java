package Backend.Model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
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
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Product product;

    @Column(name = "IMAGE_URL", nullable = false, length = 500)
    private String imageUrl;  // Đường dẫn ảnh

    @Enumerated(EnumType.STRING)
    @Column(name = "IMAGE_TYPE", nullable = false)
    private ImageType imageType;  // Loại ảnh (MAIN, SECONDARY, OTHER)

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();  // Thời gian tạo

}
