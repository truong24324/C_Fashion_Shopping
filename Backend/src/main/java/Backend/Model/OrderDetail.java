package Backend.Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "ORDER_DETAILS")
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ORDER_DETAIL_ID")
    private Integer orderDetailId;

    @ManyToOne
    @JoinColumn(name = "ORDER_ID", nullable = false)
    private Order order;

    @Column(name = "PRODUCT_NAME", nullable = false, length = 255)
    private String productName;

    @Column(name = "VARIANT_TYPE", length = 255)
    private String variantType;

    @Column(name = "VARIANT_VALUE", length = 255)
    private String variantValue;

    @Column(name = "PRODUCT_PRICE", nullable = false, precision = 18, scale = 2)
    private BigDecimal productPrice;

    @Column(name = "QUANTITY", nullable = false)
    private Integer quantity;

    @Column(name = "TOTAL_PRICE", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();
}
