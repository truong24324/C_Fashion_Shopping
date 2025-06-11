package Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.ImageType;
import Backend.Model.Product;
import Backend.Model.ProductImage;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProduct_ProductId(Integer productId);

    boolean existsByImageUrl(String imageUrl);

    boolean existsByProductAndImageType(Product product, ImageType imageType);

}
