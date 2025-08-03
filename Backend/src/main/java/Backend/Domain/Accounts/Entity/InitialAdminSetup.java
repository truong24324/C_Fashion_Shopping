package Backend.Domain.Accounts.Entity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import Backend.Domain.Accounts.Service.AccountService;
import Backend.Domain.Accounts.Service.RoleService;

@Component
public class InitialAdminSetup {

    @Autowired
    private AccountService accountService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.superadmin.email}")
    private String adminEmail;

    @Value("${app.superadmin.password}")
    private String adminPassword;

    @Value("${app.superadmin.userCode}")
    private String adminUserCode;

    @EventListener(ApplicationReadyEvent.class)
    public void setupAdminAccount() {
        Role superAdminRole = roleService.findRoleByName("Super_Admin");

        boolean hasSuperAdmin = accountService.existsByRole(superAdminRole);

        if (!hasSuperAdmin) {
            Account admin = new Account();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setUserCode(adminUserCode);
            admin.setPhone("0000000000");
            admin.setRole(superAdminRole);
            admin.setProtected(true); // Không cho xóa
            accountService.save(admin);

            System.out.println("✅ Đã khởi tạo tài khoản Super Admin: " + adminEmail);
        }
    }

}
