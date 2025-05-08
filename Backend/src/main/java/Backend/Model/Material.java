package Backend.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "MATERIALS")
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MATERIAL_ID")
    private Integer materialId;  // Sửa lại đúng tên biến

    @Column(name = "MATERIAL_NAME", unique = true, nullable = false)
    private String materialName;
}
