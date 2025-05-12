package Backend.Service;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import Backend.Model.Account;
import Backend.Model.Role;
import Backend.Repository.AccountRepository;
import Backend.Repository.RoleRepository;
import Backend.Request.AccountRequest;
import Backend.Request.RegisterRequest;
import Backend.Response.AccountResponse;
import io.swagger.v3.oas.models.security.SecurityScheme.In;
import Backend.Exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RoleRepository roleRepository;

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

    // 🔹 Xử lý đăng nhập
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

        // Đăng nhập thành công
        account.setFailedLoginAttempts(0);
        account.setLocked(false);
        account.setLockUntil(null);
        account.setLoginTime(new Date());
        accountRepository.save(account);
        return null;
    }

    // 🔹 Check trùng
    public boolean existsByEmail(String email) {
        return accountRepository.existsByEmail(email);
    }

    public boolean existsByPhone(String phone) {
        return accountRepository.existsByPhone(phone);
    }

    public boolean existsByUserCode(String userCode) {
        return accountRepository.existsByUserCode(userCode);
    }

    // 🔹 Đăng ký
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

    // 🔹 API CRUD
    public Page<AccountResponse> getAllAccounts(Pageable pageable) {
        Page<Account> page = accountRepository.findAll(pageable);
        return page.map(this::toAccountResponse);
    }
    
    public AccountResponse toAccountResponse(Account account) {
        AccountResponse res = new AccountResponse();
        res.setAccountId(account.getAccountId());
        res.setUserCode(account.getUserCode());
        res.setEmail(account.getEmail());
        res.setPhone(account.getPhone());
        res.setRoleName(account.getRoleName());
        res.setActive(account.isActive());
        res.setLocked(account.isLocked());
        res.setLoginTime(account.getLoginTime());
        res.setCreatedAt(account.getCreatedAt());
        return res;
    }

    public Account getById(Integer id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản không tồn tại"));
    }

    @Transactional
    public Account createAccount(AccountRequest request) {
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vai trò không tồn tại"));

        Account account = new Account();
        account.setUserCode(request.getUserCode());
        account.setEmail(request.getEmail());
        account.setPhone(request.getPhone());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setRole(role);
        return accountRepository.save(account);
    }

    public Account updateAccount(Integer id, AccountRequest request) {
        Account account = getById(id);
        account.setUserCode(request.getUserCode());
        account.setEmail(request.getEmail());
        account.setPhone(request.getPhone());
        account.setRole(roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vai trò không tồn tại")));
        return accountRepository.save(account);
    }

    public void deleteAccount(Integer id) {
        Account acc = getById(id);
        if (acc.isProtected()) throw new IllegalStateException("Không thể xóa tài khoản hệ thống");
        accountRepository.delete(acc);
    }

    public void lockAccount(Integer id) {
        Account acc = getById(id);
        acc.setLocked(true);
        acc.setLockUntil(new Date(System.currentTimeMillis() + 60 * 60 * 1000)); // 1 giờ
        accountRepository.save(acc);
    }

    public void unlockAccount(Integer id) {
        Account acc = getById(id);
        acc.setLocked(false);
        acc.setFailedLoginAttempts(0);
        acc.setLockUntil(null);
        accountRepository.save(acc);
    }

    public void toggleActive(Integer id) {
        Account acc = getById(id);
        acc.setActive(!acc.isActive());
        accountRepository.save(acc);
    }
}
