package Backend.Domain.Promotion.Entity;

import java.time.LocalDateTime;

import Backend.Domain.Accounts.Entity.Account;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "USER_POINT_TRANSACTIONS")
public class UserPointTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TRANSACTION_ID")
    private Integer transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ACCOUNT_ID", nullable = false)
    private Account account;

    @Column(name = "POINTS_CHANGED", nullable = false)
    private Integer pointsChanged;

    @Enumerated(EnumType.STRING)
    @Column(name = "ACTION_TYPE", length = 50, nullable = false)
    private PointActionType actionType;

    @Column(name = "DESCRIPTION", length = 255, nullable = true)
    private String description;

    @Column(name = "CREATED_AT", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    public UserPointTransaction() {
        this.createdAt = LocalDateTime.now();
    }
}