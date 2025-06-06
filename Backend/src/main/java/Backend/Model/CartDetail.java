package Backend.Model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "CART_DETAILS", uniqueConstraints = @UniqueConstraint(columnNames = {"CART_ID", "VARIANT_ID"}))
public class CartDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CART_DETAIL_ID")
    private Integer cartDetailId;

    @ManyToOne
    @JoinColumn(name = "CART_ID", nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "VARIANT_ID", nullable = false)
    private Variant variant;  // Thay vì Product, lien kết với Variant

    @Column(name = "QUANTITY", nullable = false)
    private Integer quantity;

    @Column(name = "PRICE", nullable = false, precision = 18, scale = 2)
    private BigDecimal price;

    // Constructor khởi tạo mới, sử dụng Variant thay vì Product
    public CartDetail(Cart cart, Variant variant, int quantity, BigDecimal price) {
        this.cart = cart;
        this.variant = variant;
        this.quantity = quantity;
        this.price = price;
    }
}
