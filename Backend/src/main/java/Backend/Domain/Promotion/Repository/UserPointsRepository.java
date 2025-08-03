package Backend.Domain.Promotion.Repository;

import Backend.Domain.Accounts.Entity.Account;
import Backend.Domain.Promotion.Entity.UserPoints;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPointsRepository extends JpaRepository<UserPoints, Integer> {
    Optional<UserPoints> findByAccount(Account account);
}

