package Backend.Model;
import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "VARIANTS", uniqueConstraints = {
    @UniqueConstraint(name = "UQ_VARIANT", columnNames = { "PRODUCT_ID", "COLOR_ID", "SIZE_ID", "MATERIAL_ID" })
})
public class Variant {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VARIANT_ID")
    private Integer variantId;

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COLOR_ID", referencedColumnName = "COLOR_ID")
    private Color color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SIZE_ID", referencedColumnName = "SIZE_ID")
    private Size size;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MATERIAL_ID", referencedColumnName = "MATERIAL_ID")
    private Material material;

    @Column(name = "STOCK", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer stock;

    @Column(name = "PRICE", precision = 18, scale = 2)
    private BigDecimal price;

    public Variant(Product product, Color color, Size size, Material material, int stock, BigDecimal price) {
        this.product = product;
        this.color = color;
        this.size = size;
        this.material = material;
        this.stock = stock;
        this.price = price;
    }
}
