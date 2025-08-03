package Backend.Domain.Order.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Domain.Order.Entity.Cart;
import Backend.Domain.Order.Entity.CartDetail;
import Backend.Domain.Product.Entity.Variant;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {

    // Tìm CartDetail theo Cart và Variant
    Optional<CartDetail> findByCartAndVariant(Cart cart, Variant variant);
    List<CartDetail> findByCart(Cart cart);

    // Xóa CartDetail theo Cart và Variant
    void deleteByCartAndVariant(Cart cart, Variant variant);
}
