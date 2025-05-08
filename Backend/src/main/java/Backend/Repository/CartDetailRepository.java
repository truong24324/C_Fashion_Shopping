package Backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import Backend.Model.Cart;
import Backend.Model.CartDetail;
import Backend.Model.Variant;

public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {

    // Tìm CartDetail theo Cart và Variant
    Optional<CartDetail> findByCartAndVariant(Cart cart, Variant variant);
    List<CartDetail> findByCart(Cart cart);

    // Xóa CartDetail theo Cart và Variant
    void deleteByCartAndVariant(Cart cart, Variant variant);
}
