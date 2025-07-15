package Backend.Repository;

import Backend.Model.UserPointTransaction;
import Backend.Model.Account;
import Backend.Model.PointActionType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPointTransactionRepository extends JpaRepository<UserPointTransaction, Integer> {
    List<UserPointTransaction> findByAccountOrderByCreatedAtDesc(Account account);

    List<UserPointTransaction> findByAccountAndActionTypeOrderByCreatedAtDesc(Account account, String actionType);

List<UserPointTransaction> findByAccountAndActionTypeOrderByCreatedAtDesc(Account account, PointActionType actionType);
}