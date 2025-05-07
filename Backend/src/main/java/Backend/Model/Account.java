package Backend.Model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@Entity
@Table(name = "ACCOUNTS")
public class Account implements UserDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ACCOUNT_ID")
	private Long accountId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ROLE_ID", nullable = false)
	private Role role;

	@Override
	public String getPassword() {
		return password;
	}

	@Column(name = "USER_CODE", unique = true, nullable = false, length = 50)
	private String userCode;

	@Column(name = "EMAIL", unique = true, nullable = false, length = 50)
	private String email;

	@Column(name = "PHONE", unique = true, nullable = false, length = 12)
	private String phone;

	@Column(name = "PASSWORD", nullable = false, length = 255)
	private String password;

	@Column(name = "DEVICE_NAME", length = 100)
	private String deviceName;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "LOGIN_TIME")
	private Date loginTime;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "LOGOUT_TIME")
	private Date logoutTime;

	@Column(name = "IP_ADDRESS", length = 50)
	private String ipAddress;

	@Column(name = "FAILED_LOGIN_ATTEMPTS", nullable = false, columnDefinition = "INT DEFAULT 0")
	private int failedLoginAttempts;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "CREATED_AT", nullable = false, updatable = false)
	private Date createdAt;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "UPDATED_AT", nullable = false)
	private Date updatedAt;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "PASSWORD_CHANGED_AT")
	private Date passwordChangedAt;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "LOCK_UNTIL")
	private Date lockUntil;

	@Column(name = "IS_LOCKED", nullable = false)
	private boolean isLocked = false;

	@Column(name = "IS_ACTIVE", nullable = false)
	private boolean isActive = true;

	@Column(name = "IS_PROTECTED", nullable = false)
	private boolean isProtected = false;

	public void increaseFailedAttempts() {
		this.failedLoginAttempts++;
	}

	public String getRoleName() {
	    return role != null ? role.getRoleName() : null;
	}

	public void resetFailedAttempts() {
		this.failedLoginAttempts = 0;
		this.failedLoginAttempts = 0; // Reset số lần bị khóa nếu đăng nhập đúng
	}

	public void lockAccount() {
		this.isLocked = true;
		this.failedLoginAttempts++; // Tăng số lần bị khóa

		// ⏳ Tính thời gian khóa dựa trên số lần bị khóa trước đó (mỗi lần tăng gấp đôi)
		long lockDuration = (long) (30 * Math.pow(2, this.failedLoginAttempts - 1)); // 30, 60, 120, 240, ...
		this.lockUntil = new Date(System.currentTimeMillis() + lockDuration * 60 * 1000);
	}

	// Constructor để khởi tạo ngày giờ mặc định
	@PrePersist
	protected void onCreate() {
		createdAt = new Date();
		updatedAt = new Date();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = new Date();
	}


	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
	    List<GrantedAuthority> authorities = new ArrayList();

	    // Cấp quyền từ Role (ROLE_USER, ROLE_ADMIN, ...)
	    authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRoleName()));

	    // Cấp quyền từ Permission (nếu có)
	    authorities.addAll(role.getPermissions().stream()
	        .map(permission -> new SimpleGrantedAuthority(permission.getPermissionName()))
	        .collect(Collectors.toList()));

	    return authorities;
	}

	@Override
	public String getUsername() {
		return email; // Sử dụng email làm tên đăng nhập
	}

	@Override
	public boolean isAccountNonExpired() {
		return true; // Tài khoản không hết hạn
	}

	@Override
	public boolean isAccountNonLocked() {
		if (isLocked && lockUntil != null && lockUntil.after(new Date())) {
			return false; // Tài khoản vẫn đang bị khóa
		}
		return true; // Không bị khóa
	}

//
//    @Override
//    public boolean isAccountNonLocked() {
//        return !isLocked; // Trả về trạng thái không bị khóa
//    }

	@Override
	public boolean isCredentialsNonExpired() {
		return true; // Mật khẩu không hết hạn
	}

	@Override
	public boolean isEnabled() {
		return isActive; // Kiểm tra xem tài khoản có hoạt động không
	}

}
