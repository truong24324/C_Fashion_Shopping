package Backend.Service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import Backend.Model.Role;
import Backend.Repository.RoleRepository;
import Backend.Request.RoleRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    // ✅ Lấy Role theo ID
    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }

    // ✅ Tạo mới Role
    public Role createRole(RoleRequest request) {
        Role role = new Role();
        role.setRoleName(request.getRoleName());
        role.setDescription(request.getDescription());
        role.setLoginAllowed(request.isLoginAllowed()); // Sửa ở đây
        return roleRepository.save(role);
    }

    // ✅ Cập nhật Role (chỉ cho phép cập nhật mô tả và trạng thái đăng nhập)
    public Role updateRole(Long id, RoleRequest request) {
        Role existingRole = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // Cập nhật mô tả và trạng thái đăng nhập
        existingRole.setDescription(request.getDescription());
        existingRole.setLoginAllowed(request.isLoginAllowed()); // Sửa ở đây

        return roleRepository.save(existingRole);
    }

    // ✅ Xóa Role nếu chưa được gán cho user nào
    public boolean deleteRoleIfUnused(Long id) {
        Optional<Role> role = roleRepository.findById(id);
        if (role.isPresent() && role.get().getPermissions().isEmpty()) {
            roleRepository.delete(role.get());
            return true;
        }
        return false;
    }

    // ✅ Lấy danh sách Role (phân trang)
    public Page<Role> getAllRoles(Pageable pageable) {
        return roleRepository.findAll(pageable);
    }

    public Role updateLoginAllowedStatus(Long roleId, boolean isLoginAllowed) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò với ID: " + roleId));

        if ("Super_Admin".equalsIgnoreCase(role.getRoleName())) {
            throw new RuntimeException("Không được phép cập nhật trạng thái đăng nhập của vai trò Super_Admin.");
        }

        role.setLoginAllowed(isLoginAllowed);
        return roleRepository.save(role);
    }

    public Role findRoleByName(String roleName) {
        return roleRepository.findByRoleName(roleName).orElse(null); // Or throw an exception if not found
    }
}
