package Backend.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.Supplier;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    Page<Supplier> findBySupplierNameContainingIgnoreCase(String supplierName, Pageable pageable);
}
