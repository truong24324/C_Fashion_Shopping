package Backend.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.Account;
import Backend.Model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByAccount(Account account);
    Optional<Cart> findByAccount_AccountId(Long accountId);

}
