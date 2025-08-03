package Backend.Domain.Product.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "SIZES")
public class Size {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SIZE_ID")
    private Integer sizeId;

    @Column(name = "SIZE_NAME", unique = true, nullable = false)
    private String sizeName;
}
