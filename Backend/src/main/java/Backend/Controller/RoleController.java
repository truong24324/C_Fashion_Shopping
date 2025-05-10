package Backend.Controller;

import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import Backend.Model.Role;
import Backend.Request.RoleRequest;
import Backend.Response.ApiResponse;
import Backend.Response.PaginationResponse;
import Backend.Service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    // ✅ Lấy danh sách phân trang
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    @GetMapping("/all")
    public ResponseEntity<PaginationResponse<Role>> getAllRoles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "roleName") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Role> rolePage = roleService.getAllRoles(pageable);

        PaginationResponse<Role> response = new PaginationResponse<>(
                rolePage.getContent(),
                rolePage.getNumber(),
                rolePage.getSize(),
                rolePage.getTotalElements(),
                rolePage.getTotalPages()
        );

        return ResponseEntity.ok(response);
    }

    // ✅ Tạo Role mới
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Role>> createRole(@RequestBody @Valid RoleRequest request) {
        Role createdRole = roleService.createRole(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm vai trò thành công!", createdRole));
    }

    // ✅ Cập nhật Role (chỉ cho phép cập nhật mô tả, không sửa tên quyền)
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    @PutMapping("/{roleId}")
    public ResponseEntity<ApiResponse<Role>> updateRole(@PathVariable Long id, @RequestBody RoleRequest request) {
        Role updatedRole = roleService.updateRole(id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật vai trò thành công!", updatedRole));
    }

    // ✅ Xóa Role (chỉ khi chưa gán cho user nào)
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    @DeleteMapping("/{roleId}")
    public ResponseEntity<ApiResponse<String>> deleteRole(@PathVariable Long id) {
        boolean deleted = roleService.deleteRoleIfUnused(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Xóa vai trò thành công!", null));
        }
        return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Không thể xóa vai trò đã được sử dụng!", null));
    }
}
