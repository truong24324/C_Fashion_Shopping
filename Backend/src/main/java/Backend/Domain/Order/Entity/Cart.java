package Backend.Domain.Order.Entity;

import java.time.LocalDateTime;
import java.util.List;

import Backend.Domain.Accounts.Entity.Account;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "CART")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CART_ID")
    private Integer cartId;

    @OneToOne
    @JoinColumn(name = "ACCOUNT_ID", nullable = false)
    private Account account;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartDetail> cartDetails;

    public Cart() {}

    public Cart(Account account) {
        this.account = account;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

}
