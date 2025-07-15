package Backend.Response;

import java.util.Date;

import lombok.Data;

@Data
public class AccountInfoResponse {
    private String userCode;
    private String email;
    private String phone;
    private String role;
    private String deviceName;
    private Date loginTime;
    private Date logoutTime;
    private String ipAddress;
    private Date createdAt;
    private Date updatedAt;
    private Date passwordChangedAt;
    private boolean isActive;

    // Từ bảng INFORMATION
    private String fullName;
    private Date birthday;
    private String gender;
    private String homeAddress;
    private String officeAddress;
    private String nationality;
    private String avatar;
}
