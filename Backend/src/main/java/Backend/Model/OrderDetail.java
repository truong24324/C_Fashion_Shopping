package Backend.Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
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

    @ManyToOne
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "VARIANT_ID", nullable = false)
    private Variant variant;

    @Column(name = "PRODUCT_NAME", nullable = false, length = 255)
    private String productName;

    @Column(name = "COLOR_NAME", length = 50)
    private String colorName;

    @Column(name = "SIZE_NAME", length = 20)
    private String sizeName;

    @Column(name = "MATERIAL_NAME", length = 50)
    private String materialName;

    @Column(name = "PRODUCT_PRICE", nullable = false, precision = 18, scale = 2)
    private BigDecimal productPrice;

    @Column(name = "QUANTITY", nullable = false)
    private Integer quantity;

    @Column(name = "TOTAL_PRICE", precision = 18, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();
}
