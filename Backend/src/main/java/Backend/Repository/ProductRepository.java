package Backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import Backend.Model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    Page<Product> findByProductNameContainingIgnoreCase(String keyword, Pageable pageable);
    List<Product> findTop50ByOrderByCreatedAtDesc();  // Lấy 50 sản phẩm mới nhất

    @Query(value = "SELECT TOP 10 * FROM PRODUCTS ORDER BY NEWID()", nativeQuery = true)
    List<Product> findRandomProducts();

	Optional<Product> findByProductId(Integer productId);
    boolean existsBySupplier_SupplierId(Integer supplierId);
    boolean existsByBrand_BrandId(Integer brandId);

}
