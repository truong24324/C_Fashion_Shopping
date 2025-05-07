package Backend.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.Material;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {
    boolean existsByMaterialName(String materialName);
    Page<Material> findByMaterialNameContainingIgnoreCase(String keyword, Pageable pageable);
}
