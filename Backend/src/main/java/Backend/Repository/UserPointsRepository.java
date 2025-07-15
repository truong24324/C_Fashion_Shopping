package Backend.Repository;

import Backend.Model.UserPoints;
import Backend.Model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPointsRepository extends JpaRepository<UserPoints, Integer> {
    Optional<UserPoints> findByAccount(Account account);
}

