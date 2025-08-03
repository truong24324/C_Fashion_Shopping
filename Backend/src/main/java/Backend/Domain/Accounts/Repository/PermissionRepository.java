package Backend.Domain.Accounts.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Domain.Accounts.Entity.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
