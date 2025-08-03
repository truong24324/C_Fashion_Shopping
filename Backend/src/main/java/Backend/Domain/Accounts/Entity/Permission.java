package Backend.Domain.Accounts.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PERMISSION_ID")
    private Long permissionId;

    @Column(name = "PERMISSION_NAME", unique = true, nullable = false, length = 50)
    private String permissionName;

}
