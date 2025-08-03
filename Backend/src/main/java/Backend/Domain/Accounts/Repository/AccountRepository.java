package Backend.Domain.Accounts.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import Backend.Domain.Accounts.Entity.Account;
import Backend.Domain.Accounts.Entity.Role;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
	@EntityGraph(attributePaths = {"role.permissions"})
	Optional<Account> findByEmail(String email);

	boolean existsByEmail(String email);
	boolean existsByPhone(String phone);
	boolean existsByUserCode(String userCode);
    Optional<Account> findByAccountId(Long accountId);
    List<Account> findByRole_RoleNameIgnoreCase(String roleName);
    boolean existsByRole(Role role);

	 @Query("SELECT COUNT(a) FROM Account a")
    Long countNewAccountsToday();

}
