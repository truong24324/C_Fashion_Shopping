package Backend.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.ProductStatus;

@Repository
public interface ProductStatusRepository extends JpaRepository<ProductStatus, Integer> {
    Page<ProductStatus> findByStatusNameContainingIgnoreCase(String keyword, Pageable pageable);

    boolean existsByStatusName(String statusName);

    ProductStatus findByStatusName(String statusName);
}
