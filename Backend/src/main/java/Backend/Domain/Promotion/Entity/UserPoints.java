package Backend.Domain.Promotion.Entity;

import java.time.LocalDateTime;

import Backend.Domain.Accounts.Entity.Account;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "USER_POINTS", uniqueConstraints = {
    @UniqueConstraint(name = "UQ_USER_POINTS", columnNames = {"ACCOUNT_ID"})
})
public class UserPoints {
  
    @Id
    @Column(name = "POINT_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pointId;

     @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ACCOUNT_ID", nullable = false, unique = true)
    private Account account;

    @Column(name = "CURRENT_POINTS", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer currentPoints;

    @Column(name = "UPDATED_AT", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime updateAt;

    public UserPoints() {
        this.currentPoints = 0; // Khởi tạo điểm mặc định là 0
        this.updateAt = LocalDateTime.now(); // Cập nhật thời gian hiện tại
    }

}