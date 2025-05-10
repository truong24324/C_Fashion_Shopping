package Backend.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "PRODUCT_STATUS")
public class ProductStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "STATUS_ID")
    private Integer statusId;  // Mã trạng thái (khóa chính)

    @Column(name = "STATUS_NAME", nullable = false, length = 50, unique = true)
    private String statusName;  // Tên trạng thái (ví dụ: "CÓ SẴN", "HẾT HÀNG", "NGỪNG BÁN")

    @Column(name = "DESCRIPTION", length = 255)
    private String description;  // Mô tả về trạng thái

}
