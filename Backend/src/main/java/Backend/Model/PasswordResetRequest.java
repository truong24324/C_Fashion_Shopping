package Backend.Model;

import java.time.LocalDateTime;

import org.springframework.boot.sql.init.dependency.DependsOnDatabaseInitialization;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@DependsOnDatabaseInitialization
@Entity
@Data
@Table(name = "PASSWORD_RESET_REQUESTS")
public class PasswordResetRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RESET_REQUEST_ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ACCOUNT_ID", nullable = false, unique = true)
    private Account account;

    @Column(name = "OTP", nullable = false)
    private String otp;

    @Column(name = "EXPIRES_AT", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "IS_USED", nullable = false)
    private boolean isUsed = false;

    @Column(name = "MAX_ATTEMPTS", nullable = false)
    private int maxAttempts = 5;

    @Column(name = "REQUESTED_AT", nullable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();

}
