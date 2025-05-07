package Backend.Service;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import Backend.Model.Account;
import Backend.Model.Role;
import Backend.Repository.AccountRepository;
import Backend.Request.RegisterRequest;
import jakarta.transaction.Transactional;

@Service
@Profile("user")
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION = 30 * 60 * 1000; // 30 phút

    // 🔹 Tìm tài khoản theo email
    public Optional<Account> findByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    // 🔹 Kiểm tra tài khoản bị khóa
    public boolean isAccountLocked(Account account) {
        return account.isLocked() && account.getLockUntil() != null && account.getLockUntil().after(new Date());
    }

    // 🔹 Cập nhật trạng thái khóa tài khoản
    @Transactional
    public void lockAccount(Account account) {
        account.setLocked(true);
        account.setLockUntil(new Date(System.currentTimeMillis() + LOCK_TIME_DURATION));
        accountRepository.save(account);
    }

    // 🔹 Kiểm tra thông tin đăng nhập và xử lý thất bại
    @Transactional
    public String validateLogin(Account account, String password) {
        if (!passwordEncoder.matches(password, account.getPassword())) {
            int failedAttempts = account.getFailedLoginAttempts() + 1;
            account.setFailedLoginAttempts(failedAttempts);

            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                lockAccount(account);
                return "Tài khoản đã bị khóa. Vui lòng thử lại sau!";
            }

            accountRepository.save(account);
            return "Mật khẩu không đúng. Bạn còn " + (MAX_FAILED_ATTEMPTS - failedAttempts) + " lần thử.";
        }

        // Đăng nhập thành công -> Reset số lần thất bại
        account.setFailedLoginAttempts(0);
        account.setLocked(false);
        account.setLockUntil(null);
        account.setLoginTime(new Date());

        accountRepository.save(account);
        return null; // Không có lỗi
    }

    // 🔹 Kiểm tra tồn tại email, phone, userCode
    public boolean existsByEmail(String email) {
        return accountRepository.existsByEmail(email);
    }

    public boolean existsByPhone(String phone) {
        return accountRepository.existsByPhone(phone);
    }

    public boolean existsByUserCode(String userCode) {
        return accountRepository.existsByUserCode(userCode);
    }

    // 🔹 Đăng ký tài khoản mới
    @Transactional
    public Account registerNewAccount(RegisterRequest request, Role defaultRole) {
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        Account account = new Account();
        account.setEmail(request.getEmail());
        account.setPhone(request.getPhone());
        account.setUserCode(request.getUserCode());
        account.setActive(true);
        account.setPassword(encodedPassword);
        account.setCreatedAt(new Date());
        account.setUpdatedAt(new Date());
        account.setRole(defaultRole);

        return accountRepository.save(account);
    }

    @Transactional
    public Account save(Account account) {
        return accountRepository.save(account);
    }

    public long countAccounts() {
        return accountRepository.count();
    }

}
