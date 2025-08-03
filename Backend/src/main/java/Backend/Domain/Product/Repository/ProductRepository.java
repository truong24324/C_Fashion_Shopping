package Backend.Domain.Product.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import Backend.Domain.Product.Entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    Page<Product> findByProductNameContainingIgnoreCase(String keyword, Pageable pageable);

    List<Product> findTop50ByStatus_IsActiveTrueOrderByCreatedAtDesc(); // Lấy 50 sản phẩm mới nhất

    Optional<Product> findByProductName(String productName);

    @Query(value = "SELECT TOP 10 A.PRODUCT_ID, A.PRODUCT_NAME, A.DESCRIPTION, A.BARCODE, A.BRAND_ID, " +
            "A.CATEGORY_ID, A.SUPPLIER_ID, A.STATUS_ID, A.MODEL, A.WARRANTY_PERIOD, " +
            "A.CREATED_AT, A.UPDATED_AT " +
            "FROM PRODUCTS A " +
            "INNER JOIN PRODUCT_STATUS B ON A.STATUS_ID = B.STATUS_ID " +
            "WHERE B.IS_ACTIVE = 1 " +
            "ORDER BY NEWID()", nativeQuery = true)
    List<Product> findRandomProducts();

    Optional<Product> findByProductId(Integer productId);

    boolean existsBySupplier_SupplierId(Integer supplierId);

    boolean existsByBrand_BrandId(Integer brandId);

    boolean existsByProductNameIgnoreCase(String productName);

    List<Product> findAllByStatus_IsActiveTrue();

    @Query("SELECT p.productName FROM Product p")
    List<String> findAllProductNames();

}
