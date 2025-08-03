package Backend.Domain.Product.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Backend.Domain.Product.DTO.Request.VariantRequest;
import Backend.Domain.Product.Entity.Color;
import Backend.Domain.Product.Entity.Material;
import Backend.Domain.Product.Entity.Product;
import Backend.Domain.Product.Entity.Size;
import Backend.Domain.Product.Entity.Variant;
import Backend.Domain.Product.Repository.ColorRepository;
import Backend.Domain.Product.Repository.MaterialRepository;
import Backend.Domain.Product.Repository.ProductRepository;
import Backend.Domain.Product.Repository.SizeRepository;
import Backend.Domain.Product.Repository.VariantRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VariantService {
    private final VariantRepository variantRepository;
    private final ProductRepository productRepository;
    private final ColorRepository colorRepository;
    private final SizeRepository sizeRepository;
    private final MaterialRepository materialRepository;

    // ✅ Lấy danh sách variant có phân trang
    public Page<Variant> getAllVariants(Pageable pageable) {
        return variantRepository.findAll(pageable);
    }

    // ✅ Tìm variant theo productId có phân trang
    public Page<Variant> searchVariantsByProduct(Integer productId, Pageable pageable) {
        return variantRepository.findByProduct_ProductId(productId, pageable);
    }

    // ✅ Thêm mới variant
    @Transactional
    public Variant createVariant(VariantRequest request) {
        // Lấy entity từ database
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        Color color = (request.getColor() != null) ? colorRepository.findById(request.getColor()).orElse(null) : null;
        Size size = (request.getSize() != null) ? sizeRepository.findById(request.getSize()).orElse(null) : null;
        Material material = (request.getMaterial() != null) ? materialRepository.findById(request.getMaterial()).orElse(null) : null;

        Variant variant = new Variant();
        variant.setProduct(product);
        variant.setColor(color);
        variant.setSize(size);
        variant.setMaterial(material);
        variant.setStock(request.getStock());
        variant.setPrice(request.getPrice());

        return variantRepository.save(variant);
    }

    @Transactional
    public List<Variant> createVariants(List<VariantRequest> variantRequests) {
        List<Variant> variants = variantRequests.stream()
                .map(req -> {
                    Product product = productRepository.findById(req.getProductId())
                            .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!"));

                    Color color = (req.getColor() != null) ? colorRepository.findById(req.getColor()).orElse(null) : null;
                    Size size = (req.getSize() != null) ? sizeRepository.findById(req.getSize()).orElse(null) : null;
                    Material material = (req.getMaterial() != null) ? materialRepository.findById(req.getMaterial()).orElse(null) : null;

                    // ✅ Kiểm tra xem variant đã tồn tại chưa
                    if (variantRepository.existsByProductAndColorAndSizeAndMaterial(product, color, size, material)) {
                        throw new RuntimeException("Variant đã tồn tại!");
                    }

                    return new Variant(product, color, size, material, req.getStock(), req.getPrice());
                })
                .collect(Collectors.toList());

        return variantRepository.saveAll(variants);
    }

    // ✅ Cập nhật variant
    @Transactional
    public Variant updateVariant(Integer variantId, VariantRequest request) {
        Variant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant không tồn tại"));

        // Chỉ cập nhật nếu request có giá trị mới
        if (request.getProductId() != null) {
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
            variant.setProduct(product);
        }

        if (request.getColor() != null) {
            Color color = colorRepository.findById(request.getColor())
                    .orElseThrow(() -> new RuntimeException("Màu không tồn tại"));
            variant.setColor(color);
        }

        if (request.getSize() != null) {
            Size size = sizeRepository.findById(request.getSize())
                    .orElseThrow(() -> new RuntimeException("Kích cỡ không tồn tại"));
            variant.setSize(size);
        }

        if (request.getMaterial() != null) {
            Material material = materialRepository.findById(request.getMaterial())
                    .orElseThrow(() -> new RuntimeException("Chất liệu không tồn tại"));
            variant.setMaterial(material);
        }

        if (request.getStock() != null) {
            variant.setStock(request.getStock());
        }

        if (request.getPrice() != null) {
            variant.setPrice(request.getPrice());
        }

        return variantRepository.save(variant);
    }

    // ✅ Xóa variant
    @Transactional
    public void deleteVariant(Integer variantId) {
        if (!variantRepository.existsById(variantId)) {
            throw new IllegalStateException("Biến thể không tồn tại");
        }

        // Kiểm tra nếu variant đang được sử dụng (trong đơn hàng, giỏ hàng, v.v.)
        if (variantRepository.existsById(variantId)) {
            throw new IllegalStateException("Không thể xóa biến thể vì đang được sử dụng trong đơn hàng");
        }

        variantRepository.deleteById(variantId);
    }

}
