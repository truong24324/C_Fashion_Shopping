package Backend.Domain.Promotion.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Domain.Promotion.Entity.Discount;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Integer> {
	boolean existsByDiscountCode(String code);

	Optional<Discount> findByDiscountCode(String code);

	List<Discount> findByIsActiveTrue();

    Optional<Discount> findByDiscountCodeAndIsActiveTrue(String code);

}
