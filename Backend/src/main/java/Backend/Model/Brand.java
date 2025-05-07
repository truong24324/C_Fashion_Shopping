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
