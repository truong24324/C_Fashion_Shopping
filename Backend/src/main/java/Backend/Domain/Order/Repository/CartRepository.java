package Backend.Domain.Order.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Domain.Accounts.Entity.Account;
import Backend.Domain.Order.Entity.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByAccount(Account account);
    Optional<Cart> findByAccount_AccountId(Long accountId);

}
