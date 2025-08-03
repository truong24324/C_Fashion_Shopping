package Backend.Domain.Product.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "CATEGORIES")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CATEGORY_ID")
    private Integer categoryId;

    @Column(name = "CATEGORY_NAME", nullable = false, unique = true, length = 100)
    private String categoryName;

    @Column(name = "DESCRIPTION", length = 255)
    private String description;

}
