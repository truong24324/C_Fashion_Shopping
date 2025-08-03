package Backend.Domain.Product.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import Backend.Domain.Product.Entity.Material;
import Backend.Domain.Product.Repository.MaterialRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MaterialService {
    private final MaterialRepository materialRepository;

    // Lấy danh sách chất liệu có phân trang
    public Page<Material> getAllMaterials(Pageable pageable) {
        return materialRepository.findAll(pageable);
    }

    // Tìm kiếm chất liệu theo tên có phân trang
    public Page<Material> searchMaterials(String keyword, Pageable pageable) {
        return materialRepository.findByMaterialNameContainingIgnoreCase(keyword, pageable);
    }

    // Kiểm tra chất liệu có tồn tại hay không
    public boolean isMaterialNameExists(String materialName) {
        return materialRepository.existsByMaterialName(materialName);
    }

    // Tạo chất liệu mới
    public Material createMaterial(String materialName) {
        Material material = new Material();
        material.setMaterialName(materialName);
        return materialRepository.save(material);
    }

    // Lấy chất liệu theo ID
    public Material getMaterialById(Integer materialId) {
        return materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chất liệu với ID: " + materialId));
    }

    // Cập nhật chất liệu
    public Material updateMaterial(Integer materialId, String materialName) {
        Material material = getMaterialById(materialId);
        material.setMaterialName(materialName);
        return materialRepository.save(material);
    }

    // Xóa chất liệu
    public void deleteMaterial(Integer materialId) {
        materialRepository.deleteById(materialId);
    }
}
