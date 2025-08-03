package Backend.Domain.Product.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Backend.Domain.Product.DTO.Request.ProductStatusRequest;
import Backend.Domain.Product.Entity.ProductStatus;
import Backend.Domain.Product.Repository.ProductStatusRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductStatusService {

    private final ProductStatusRepository productStatusRepository;

    // ✅ Lấy danh sách trạng thái sản phẩm có phân trang
    public Page<ProductStatus> getAllProductStatuses(Pageable pageable) {
        return productStatusRepository.findAll(pageable);
    }

    // ✅ Tìm kiếm trạng thái sản phẩm theo tên
//    public Page<ProductStatus> searchProductStatus(String keyword, Pageable pageable) {
//        return productStatusRepository.findByStatusNameContainingIgnoreCase(keyword, pageable);
//    }

    // ✅ Thêm mới trạng thái sản phẩm
    @Transactional
    public ProductStatus createProductStatus(ProductStatusRequest request) {
        if (productStatusRepository.existsByStatusName(request.getStatusName())) {
            throw new IllegalArgumentException("Trạng thái sản phẩm đã tồn tại!");
        }

        ProductStatus status = new ProductStatus();
        status.setStatusName(request.getStatusName());
        status.setIsActive(request.getIsActive() != null ? request.getIsActive() : true); 
        status.setDescription(request.getDescription());

        return productStatusRepository.save(status);
    }

    // ✅ Cập nhật trạng thái sản phẩm
    @Transactional
    public ProductStatus updateProductStatus(Integer statusId, ProductStatusRequest request) {
        ProductStatus existingStatus = productStatusRepository.findById(statusId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy trạng thái sản phẩm!"));

        if (!existingStatus.getStatusName().equals(request.getStatusName()) &&
                productStatusRepository.existsByStatusName(request.getStatusName())) {
            throw new IllegalArgumentException("Tên trạng thái sản phẩm đã tồn tại!");
        }

        existingStatus.setStatusName(request.getStatusName());
        existingStatus.setDescription(request.getDescription());

        return productStatusRepository.save(existingStatus);
    }

    // ✅ Xóa trạng thái sản phẩm
    @Transactional
    public void deleteProductStatus(Integer statusId) {
        if (!productStatusRepository.existsById(statusId)) {
            throw new IllegalArgumentException("Không tìm thấy trạng thái sản phẩm để xóa!");
        }
        productStatusRepository.deleteById(statusId);
    }

    // ✅ Cập nhật trạng thái hoạt động của trạng thái sản phẩm
    public void updateStatus(Integer statusId, boolean isActive) {
        ProductStatus productStatus = productStatusRepository.findById(statusId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái sản phẩm!"));

        productStatus.setIsActive(isActive);
        productStatusRepository.save(productStatus);
    }
}
