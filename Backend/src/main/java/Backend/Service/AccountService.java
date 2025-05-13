package Backend.Service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
public class AccountService implements UserDetailsService{

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION = 30 * 60 * 1000; // 30 phút

    public List<AccountResponse> getAccountsByRole(String roleName) {
        List<Account> accounts = accountRepository.findByRole_RoleNameIgnoreCase(roleName);

        return accounts.stream().map(account -> {
            AccountResponse response = new AccountResponse();
            response.setAccountId(account.getAccountId());
            response.setEmail(account.getEmail());
            response.setPhone(account.getPhone());
            response.setRoleName(account.getRole().getRoleName());
            response.setLocked(account.isLocked());
            response.setActive(account.isActive());
            return response;
        }).collect(Collectors.toList());
    }
    
    public String promoteAccountRole(Integer accountId) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        String currentRole = account.getRoleName();
        Role newRole;

        switch (currentRole) {
            case "Customer" -> {
                newRole = roleRepository.findByRoleName("Manager")
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò Manager"));
            }
            case "Manager" -> {
                newRole = roleRepository.findByRoleName("Admin")
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò Admin"));
            }
            case "Admin" -> {
                newRole = roleRepository.findByRoleName("Customer")
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò Customer"));
            }
            default -> throw new RuntimeException("Không hỗ trợ thay đổi vai trò cho: " + currentRole);
        }

        account.setRole(newRole);
        accountRepository.save(account);

        return String.format("Đã thay đổi vai trò từ %s ➡ %s", currentRole, newRole.getRoleName());
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account account = accountRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản: " + email));

        if (!account.isActive()) {
            throw new DisabledException("Tài khoản đã bị vô hiệu hóa");
        }

        if (isAccountLocked(account)) {
            throw new LockedException("Tài khoản đang bị khóa tạm thời");
        }

        return account;
    }

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

    public void deleteAccount(Integer targetId, Account requester) {
        Account target = getById(targetId);

        if (target.isProtected()) {
            throw new IllegalStateException("Không thể xóa tài khoản hệ thống");
        }

        if (target.getAccountId().equals(requester.getAccountId())) {
            throw new IllegalStateException("Không thể thực hiện thao tác này trên chính tài khoản của bạn!");
        }

        if (target.getRole().getRoleName().equals("Super_Admin") && !requester.getRole().getRoleName().equals("Super_Admin")) {
            throw new IllegalStateException("Không được phép xóa Super Admin!");
        }

        accountRepository.delete(target);
    }


    public void toggleLock(Integer targetId, Account requester) {
        Account target = getById(targetId);

        if (target.getRole().getRoleName().equals("Super_Admin") && !requester.getRole().getRoleName().equals("Super_Admin")) {
            throw new IllegalStateException("Không được phép khóa/mở Super Admin!");
        }

        if (target.getAccountId().equals(requester.getAccountId())) {
            throw new IllegalStateException("Không thể thực hiện thao tác này trên chính tài khoản của bạn!");
        }

        target.setLocked(!target.isLocked());
        accountRepository.save(target);
    }
    
    public void toggleActive(Integer targetId, Account requester) {
        Account target = getById(targetId);

        if (target.getRole().getRoleName().equals("Super_Admin") && !requester.getRole().getRoleName().equals("Super_Admin")) {
            throw new IllegalStateException("Không được phép thay đổi trạng thái hoạt động của Super Admin!");
        }

        if (target.getAccountId().equals(requester.getAccountId())) {
            throw new IllegalStateException("Không thể thực hiện thao tác này trên chính tài khoản của bạn!");
        }

        target.setActive(!target.isActive());
        accountRepository.save(target);
    }
    
    public boolean existsByRole(Role role) {
        return accountRepository.existsByRole(role);
    }

}
