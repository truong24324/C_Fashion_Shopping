package Backend.Domain.Product.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Domain.Product.Entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    boolean existsByCategoryName(String categoryName);
    Page<Category> findByCategoryNameContainingIgnoreCase(String keyword, Pageable pageable);
}
