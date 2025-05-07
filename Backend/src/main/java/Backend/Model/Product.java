package Backend.Model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "PRODUCTS")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PRODUCT_ID")
    private Integer productId;

    @Column(name = "PRODUCT_NAME", nullable = false, length = 255)
    private String productName;

    @Column(name = "DESCRIPTION", length = 1000)
    private String description;

    @Column(name = "BARCODE", length = 20, unique = true)
    private String barcode;

    @ManyToOne
    @JoinColumn(name = "BRAND_ID", nullable = false)
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "SUPPLIER_ID", nullable = false)
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "STATUS_ID", referencedColumnName = "STATUS_ID")
    private ProductStatus status;  // Product's status (many-to-one relationship)

    @Column(name = "MODEL", length = 100)
    private String model;

    @Column(name = "WARRANTY_PERIOD", length = 50)
    private String warrantyPeriod;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Variant> variants = new ArrayList<>();

}
