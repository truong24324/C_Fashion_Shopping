package Backend.Domain.Product.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import Backend.Domain.Product.Entity.Color;
import Backend.Domain.Product.Entity.Material;
import Backend.Domain.Product.Entity.Product;
import Backend.Domain.Product.Entity.Size;
import Backend.Domain.Product.Entity.Variant;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.Tuple;

@Repository
public interface VariantRepository extends JpaRepository<Variant, Integer> {

    // Tìm variants theo productId có phân trang
    Page<Variant> findByProduct_ProductId(Integer productId, Pageable pageable);

    // Kiểm tra variant đã tồn tại chưa (dựa vào Product, Color, Size, Material)
    boolean existsByProduct_ProductIdAndColor_ColorIdAndSize_SizeIdAndMaterial_MaterialId(
            Integer productId, Integer colorId, Integer sizeId, Integer materialId);

    boolean existsByProductAndColorAndSizeAndMaterial(Product product, Color color, Size size, Material material);

    List<Variant> findByProduct_ProductId(Integer productId);

   // BigDecimal findTopByProductOrderByPriceAsc(Product product);  // Lấy giá thấp nhất của sản phẩm

    @Query("SELECT v.product.productId AS productId, MIN(v.price) AS minPrice FROM Variant v WHERE v.product = :product GROUP BY v.product.productId")
    List<Tuple> findMinPriceByProduct(Product product);

    @Override
	Optional<Variant> findById(Integer variantId);

    @Query("SELECT v FROM Variant v WHERE v.product.id = :productId AND v.color.colorCode = :color AND v.size.sizeName = :size AND v.material.materialName = :material")
    Optional<Variant> findByProductAndAttributes(
        @Param("productId") Integer productId,
        @Param("color") String color,
        @Param("size") String size,
        @Param("material") String material
    );

}
