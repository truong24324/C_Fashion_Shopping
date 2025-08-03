package Backend.Domain.Product.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "BRANDS")
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BRAND_ID")
    private Integer brandId;

    @Column(name = "BRAND_NAME", nullable = false, length = 200)
    private String brandName;

    @Column(name = "LOGO", length = 100)
    private String logo;

}
