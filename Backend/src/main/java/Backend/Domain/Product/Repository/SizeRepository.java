package Backend.Domain.Product.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Domain.Product.Entity.Size;

@Repository
public interface SizeRepository extends JpaRepository<Size, Integer> {
    boolean existsBySizeName(String sizeName);
    Page<Size> findBySizeNameContainingIgnoreCase(String keyword, Pageable pageable);
}
