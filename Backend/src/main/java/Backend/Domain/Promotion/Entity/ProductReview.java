package Backend.Domain.Promotion.Entity;

import java.time.LocalDateTime;

import Backend.Domain.Accounts.Entity.Account;
import Backend.Domain.Order.Entity.OrderDetail;
import Backend.Domain.Product.Entity.Product;
import Backend.Domain.Product.Entity.Variant;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "PRODUCT_REVIEWS")
public class ProductReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REVIEW_ID")
    private Integer reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ORDER_DETAIL_ID", nullable = false)
    private OrderDetail orderDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ACCOUNT_ID", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VARIANT_ID", nullable = false)
    private Variant variant;

    @Column(name = "RATING", nullable = false)
    private Integer rating;

    @Column(name = "TITLE", length = 255)
    private String title;

    @Column(name = "CONTENT", columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "IS_VISIBLE")
    private Boolean isVisible = true;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
