package Backend.Domain.Accounts.Entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ROLES")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ROLE_ID")
    private Long roleId;

    @Column(name = "ROLE_NAME", unique = true, nullable = false, length = 50)
    private String roleName;

    @Column(name = "IS_LOGIN_ALLOWED", nullable = false)
    private boolean isLoginAllowed;

    @Column(name = "DESCRIPTION", length = 255)
    private String description;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "ROLE_PERMISSIONS",
            joinColumns = @JoinColumn(name = "ROLE_ID"),
            inverseJoinColumns = @JoinColumn(name = "PERMISSION_ID")
    )
    private Set<Permission> permissions;

    @JsonCreator
    public Role(@JsonProperty("roleId") Long roleId, @JsonProperty("roleName") String roleName) {
        this.roleId = roleId;
        this.roleName = roleName;
    }

}
