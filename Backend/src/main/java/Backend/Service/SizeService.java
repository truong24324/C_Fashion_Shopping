package Backend.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import Backend.Model.Size;
import Backend.Repository.SizeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SizeService {
    private final SizeRepository sizeRepository;

    // Lấy danh sách kích thước có phân trang
    public Page<Size> getAllSizes(Pageable pageable) {
        return sizeRepository.findAll(pageable);
    }

    // Tìm kiếm kích thước theo tên có phân trang
    public Page<Size> searchSizes(String keyword, Pageable pageable) {
        return sizeRepository.findBySizeNameContainingIgnoreCase(keyword, pageable);
    }

    // Kiểm tra kích thước có tồn tại hay không
    public boolean isSizeNameExists(String sizeName) {
        return sizeRepository.existsBySizeName(sizeName);
    }

    // Tạo kích thước mới
    public Size createSize(String sizeName) {
        Size size = new Size();
        size.setSizeName(sizeName);
        return sizeRepository.save(size);
    }

    // Lấy kích thước theo ID
    public Size getSizeById(Integer sizeId) {
        return sizeRepository.findById(sizeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kích thước với ID: " + sizeId));
    }

    // Cập nhật kích thước
    public Size updateSize(Integer sizeId, String sizeName) {
        Size size = getSizeById(sizeId);
        size.setSizeName(sizeName);
        return sizeRepository.save(size);
    }

    // Xóa kích thước
    public void deleteSize(Integer sizeId) {
        sizeRepository.deleteById(sizeId);
    }
}
