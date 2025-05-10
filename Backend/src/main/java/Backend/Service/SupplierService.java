package Backend.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import Backend.Model.Supplier;
import Backend.Repository.ProductRepository;
import Backend.Repository.SupplierRepository;
import Backend.Request.SupplierRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;

    // ✅ Lấy danh sách nhà cung cấp có phân trang
    public Page<Supplier> getAllSuppliers(Pageable pageable) {
        return supplierRepository.findAll(pageable);
    }

 // ✅ Lấy danh sách tên nhà cung cấp
    public Page<String> getSupplierNames(Pageable pageable) {
        return supplierRepository.findAll(pageable)
                .map(Supplier::getSupplierName);
    }

    // ✅ Tìm kiếm nhà cung cấp theo tên (có phân trang)
    public Page<Supplier> searchSuppliers(String keyword, Pageable pageable) {
        return supplierRepository.findBySupplierNameContainingIgnoreCase(keyword, pageable);
    }

    // ✅ Thêm mới nhà cung cấp
    public Supplier createSupplier(SupplierRequest request) {
        Supplier supplier = new Supplier();
        supplier.setSupplierName(request.getSupplierName());
        supplier.setContactName(request.getContactName());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        return supplierRepository.save(supplier);
    }

    // ✅ Cập nhật nhà cung cấp
    public Supplier updateSupplier(Integer supplierId, SupplierRequest request) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new EntityNotFoundException("Nhà cung cấp không tồn tại"));

        supplier.setSupplierName(request.getSupplierName());
        supplier.setContactName(request.getContactName());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        return supplierRepository.save(supplier);
    }

    // ✅ Xóa nhà cung cấp
    public void deleteSupplier(Integer supplierId) {
        if (!supplierRepository.existsById(supplierId)) {
            throw new EntityNotFoundException("Nhà cung cấp không tồn tại");
        }

        // Kiểm tra xem nhà cung cấp có đang được sử dụng ở bảng khác không
        boolean isUsedInProducts = productRepository.existsBySupplier_SupplierId(supplierId);

        if (isUsedInProducts) {
            throw new IllegalStateException("Không thể xóa nhà cung cấp vì đang được sử dụng ở nơi khác");
        }

        supplierRepository.deleteById(supplierId);
    }

}
