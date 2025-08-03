package Backend.Domain.Promotion.Repository;

import Backend.Domain.Accounts.Entity.Account;
import Backend.Domain.Promotion.Entity.PointActionType;
import Backend.Domain.Promotion.Entity.UserPointTransaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPointTransactionRepository extends JpaRepository<UserPointTransaction, Integer> {
    List<UserPointTransaction> findByAccountOrderByCreatedAtDesc(Account account);

    List<UserPointTransaction> findByAccountAndActionTypeOrderByCreatedAtDesc(Account account, String actionType);

List<UserPointTransaction> findByAccountAndActionTypeOrderByCreatedAtDesc(Account account, PointActionType actionType);
}