package Backend.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    Page<Brand> findByBrandNameContainingIgnoreCase(String keyword, Pageable pageable);
    boolean existsByBrandName(String brandName);

}
