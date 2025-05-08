package Backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.Wishlist;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    boolean existsByAccount_AccountIdAndProduct_ProductId(Integer accountId, Integer productId);
    Optional<Wishlist> findByAccount_AccountIdAndProduct_ProductId(Integer accountId, Integer productId);

    List<Wishlist> findByAccount_AccountIdAndIsDeletedFalse(Long accountId);

}
