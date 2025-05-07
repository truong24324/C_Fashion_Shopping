package Backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
	@EntityGraph(attributePaths = {"role.permissions"})
	Optional<Account> findByEmail(String email);

	boolean existsByEmail(String email);
	boolean existsByPhone(String phone);
	boolean existsByUserCode(String userCode);
    Optional<Account> findByAccountId(Long accountId);
}
