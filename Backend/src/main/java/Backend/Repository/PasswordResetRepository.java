package Backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import Backend.Model.Account;
import Backend.Model.PasswordResetRequest;
import jakarta.transaction.Transactional;

@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordResetRequest, Long> {
	Optional<PasswordResetRequest> findByOtpAndIsUsedFalse(String otp);

	PasswordResetRequest findByOtp(String otp);

	@Modifying
	@Transactional
	@Query("DELETE FROM PasswordResetRequest p WHERE p.account = :account")
	void deleteByAccount(@Param("account") Account account);

	Optional<PasswordResetRequest> findTopByOtpAndIsUsedFalseOrderByRequestedAtDesc(String otp);

	// 🔍 Lấy yêu cầu đặt lại mật khẩu mới nhất chưa sử dụng của tài khoản
	Optional<PasswordResetRequest> findTopByAccountAndIsUsedFalseOrderByRequestedAtDesc(Account account);
    Optional<PasswordResetRequest> findTopByAccountAndOtpAndIsUsedFalseOrderByRequestedAtDesc(Account account, String otp);


}
