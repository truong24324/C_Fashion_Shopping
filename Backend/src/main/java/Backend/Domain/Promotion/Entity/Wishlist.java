package Backend.Domain.Promotion.Entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import Backend.Domain.Accounts.Entity.Account;
import Backend.Domain.Product.Entity.Product;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(
    name = "WISHLISTS",
    uniqueConstraints = @UniqueConstraint(columnNames = {"ACCOUNT_ID", "PRODUCT_ID"})
)
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "WISHLIST_ID")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ACCOUNT_ID", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;

    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "IS_DELETED")
    private Boolean isDeleted = false;
}
