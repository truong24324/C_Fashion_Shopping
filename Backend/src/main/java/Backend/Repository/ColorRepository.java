package Backend.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.Color;

@Repository
public interface ColorRepository extends JpaRepository<Color, Integer> {
    boolean existsByColorName(String colorName);
    Page<Color> findByColorNameContainingIgnoreCase(String keyword, Pageable pageable);
}
