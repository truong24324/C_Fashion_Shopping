package Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
