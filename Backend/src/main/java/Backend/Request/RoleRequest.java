package Backend.Request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RoleRequest {

    private Long roleId;

    @NotBlank(message = "Tên quyền không được để trống")
    private String roleName;

    private boolean isLoginAllowed = true;

    private String description;

    // Thêm danh sách quyền (permission)
    private List<Long> permissions;
}
