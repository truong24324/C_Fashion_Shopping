package Backend.Model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "DISCOUNTS")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DISCOUNT_ID")
    private Integer discountId;

    @Column(name = "DISCOUNT_CODE", nullable = false, unique = true)
    private String discountCode;

    @Column(name = "DISCOUNT_VALUE", nullable = false)
    private Double discountValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "DISCOUNT_TYPE", nullable = false)
    private DiscountType discountType;

    @Column(name = "IS_ACTIVE", nullable = false)
    private Boolean isActive = true;

    @Column(name = "QUANTITY", nullable = false)
    private Integer quantity;

    @Column(name = "MAX_USAGE_PER_USER")
    private Integer maxUsagePerUser;

    @Column(name = "MIN_ORDER_AMOUNT")
    private Double minOrderAmount;

    @Column(name = "START_DATE", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "END_DATE")
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "APPLY_TYPE", nullable = false)
    private DiscountApplyType applyType = DiscountApplyType.SUBTOTAL; // mặc định giảm trên subtotal

    @Column(name = "DESCRIPTION")
    private String description;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
}
