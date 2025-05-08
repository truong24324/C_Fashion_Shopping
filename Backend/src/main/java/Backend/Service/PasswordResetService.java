package Backend.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Backend.Model.Account;
import Backend.Model.PasswordResetRequest;
import Backend.Repository.AccountRepository;
import Backend.Repository.PasswordResetRepository;

@Service
public class PasswordResetService {
	private static final int MAX_ATTEMPTS = 5; // Số lần nhập OTP tối đa

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private PasswordResetRepository resetRepository;

	@Autowired
	private EmailService emailService;

	// Kiểm tra xem OTP có phải là chuỗi số đơn giản như "000000" hay "123456"
	private boolean isSimpleOtp(String otp) {
		return otp.matches("(\\d)\\1{5,}") || otp.matches("123456|654321");
	}

	public String generateOtp() {
		SecureRandom random = new SecureRandom();
		String otp;

		do {
			otp = String.format("%06d", random.nextInt(999999)); // Tạo OTP 6 chữ số
		} while (isSimpleOtp(otp)); // Kiểm tra OTP không phải chuỗi số đơn giản

		return otp;
	}

	@Transactional
	public void sendOtp(String email) {
		if (email == null || email.isEmpty()) {
			throw new IllegalArgumentException("Email recipient is missing.");
		}

		Account account = accountRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Email không tồn tại"));

		// Xóa OTP cũ trước khi tạo mới
		resetRepository.deleteByAccount(account);

		// Tạo mã OTP mới
		String otp = generateOtp();
		PasswordResetRequest request = new PasswordResetRequest();
		request.setAccount(account);
		request.setOtp(otp);
		request.setExpiresAt(LocalDateTime.now().plusMinutes(15));
		request.setMaxAttempts(MAX_ATTEMPTS);
		request.setUsed(false);

		resetRepository.save(request);

		emailService.sendOtpEmail(email, otp); // Gửi email với giao diện HTML
	}

	@Transactional
	public boolean verifyOtp(String otp) {
		Optional<PasswordResetRequest> optionalRequest = resetRepository
				.findTopByOtpAndIsUsedFalseOrderByRequestedAtDesc(otp);

		if (optionalRequest.isEmpty()) {
			return false; // OTP không tồn tại hoặc đã hết hạn
		}

		PasswordResetRequest request = optionalRequest.get();

		if (request.getExpiresAt().isBefore(LocalDateTime.now()) || request.isUsed()) {
			resetRepository.deleteByAccount(request.getAccount());
			return false;
		}

		// resetRepository.deleteByAccount(request.getAccount());
		return true;
	}

//	@Transactional
//	public boolean decreaseOtpAttempts(String email) {
//		Optional<Account> accountOpt = accountRepository.findByEmail(email);
//		if (accountOpt.isEmpty()) {
//			return false;
//		}
//
//		Account account = accountOpt.get();
//		Optional<PasswordResetRequest> requestOpt = resetRepository
//				.findTopByAccountAndIsUsedFalseOrderByRequestedAtDesc(account);
//		if (requestOpt.isEmpty()) {
//			return false;
//		}
//
//		PasswordResetRequest request = requestOpt.get();
//
//		if (request.getExpiresAt().isBefore(LocalDateTime.now()) || request.isUsed()) {
//			resetRepository.deleteByAccount(account);
//			return false;
//		}
//
//		int remainingAttempts = request.getMaxAttempts();
//		if (remainingAttempts > 1) {
//			request.setMaxAttempts(remainingAttempts - 1);
//			resetRepository.save(request);
//
//			account.increaseFailedAttempts();
//			accountRepository.save(account);
//			return true;
//		}
//
//		account.setLocked(true);
//		account.setLockUntil(new Date(System.currentTimeMillis() + 30 * 60 * 1000));
//		accountRepository.save(account);
//
//		resetRepository.deleteByAccount(account);
//		return false;
//	}

	@Transactional
	public int decreaseOtpAttempts(String email) {
		Optional<Account> accountOpt = accountRepository.findByEmail(email);
		if (accountOpt.isEmpty()) {
			return -1; // Không tìm thấy tài khoản
		}

		Account account = accountOpt.get();
		Optional<PasswordResetRequest> requestOpt = resetRepository
				.findTopByAccountAndIsUsedFalseOrderByRequestedAtDesc(account);
		if (requestOpt.isEmpty()) {
			return -1; // Không có yêu cầu đặt lại mật khẩu hợp lệ
		}

		PasswordResetRequest request = requestOpt.get();

		if (request.getExpiresAt().isBefore(LocalDateTime.now()) || request.isUsed()) {
			resetRepository.deleteByAccount(account);
			return -1; // OTP đã hết hạn hoặc bị sử dụng
		}

		int remainingAttempts = request.getMaxAttempts();
		if (remainingAttempts > 1) {
			request.setMaxAttempts(remainingAttempts - 1);
			resetRepository.save(request);

			account.increaseFailedAttempts();
			accountRepository.save(account);
			return remainingAttempts - 1; // Trả về số lần còn lại
		}

		// Nếu đã nhập sai quá số lần cho phép -> Khóa tài khoản
		account.setLocked(true);
		account.setLockUntil(new Date(System.currentTimeMillis() + 30 * 60 * 1000)); // Khóa 30 phút
		accountRepository.save(account);

		resetRepository.deleteByAccount(account);
		return 0; // Hết lượt nhập OTP
	}

	@Transactional
	public boolean resetPassword(String email, String otp, String newPassword) {
		Optional<Account> accountOpt = accountRepository.findByEmail(email);
		if (accountOpt.isEmpty()) {
			return false; // Không tìm thấy tài khoản với email này
		}

		Account account = accountOpt.get();
		Optional<PasswordResetRequest> requestOpt = resetRepository
				.findTopByAccountAndOtpAndIsUsedFalseOrderByRequestedAtDesc(account, otp);

		if (requestOpt.isEmpty()) {
			return false; // OTP không hợp lệ hoặc đã được sử dụng
		}

		PasswordResetRequest request = requestOpt.get();

		// Kiểm tra xem OTP có hết hạn không
		if (request.getExpiresAt().isBefore(LocalDateTime.now())) {
			return false; // OTP đã hết hạn, nhưng không xóa ở đây để tránh mất dữ liệu chưa kiểm tra
		}

		// Đặt lại mật khẩu mới
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String encodedPassword = encoder.encode(newPassword);
		account.setPassword(encodedPassword); // Lưu mật khẩu đã mã hóa
		account.setLocked(false);
		account.setLockUntil(new Date(System.currentTimeMillis() + 00 * 60 * 1000)); // Khóa 30 phút
		accountRepository.save(account);

		// Đánh dấu OTP là đã sử dụng
		request.setUsed(true);
		resetRepository.save(request);

		return true; // Mật khẩu đã được thay đổi
	}

}
