package Backend.Response;

import java.util.Date;

import lombok.Data;

@Data
public class AccountResponse {
    private Long accountId;
    private String userCode;
    private String email;
    private String phone;
    private String roleName;
    private boolean isActive;
    private boolean isLocked;
    private Date loginTime;
    private Date createdAt;
}
