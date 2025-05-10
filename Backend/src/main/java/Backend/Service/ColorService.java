package Backend.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import Backend.Model.Color;
import Backend.Repository.ColorRepository;
import Backend.Request.ColorUpdateRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ColorService {
    private final ColorRepository colorRepository;

    // Lấy danh sách màu có phân trang
    public Page<Color> getAllColors(Pageable pageable) {
        return colorRepository.findAll(pageable);
    }

    // Tìm kiếm màu theo tên có phân trang
    public Page<Color> searchColors(String keyword, Pageable pageable) {
        return colorRepository.findByColorNameContainingIgnoreCase(keyword, pageable);
    }

    // Kiểm tra màu có tồn tại hay không
    public boolean isColorNameExists(String colorName) {
        return colorRepository.existsByColorName(colorName);
    }

    // Tạo màu mới
    public Color createColor(String colorName, String colorCode) {
        Color color = new Color();
        color.setColorName(colorName);
        color.setColorCode(colorCode);
        return colorRepository.save(color);
    }

    // Lấy màu theo ID
    public Color getColorById(Integer colorId) {
        return colorRepository.findById(colorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy màu với ID: " + colorId));
    }

    // Cập nhật màu
    public Color updateColor(Integer colorId, ColorUpdateRequest request) {
        Color color = getColorById(colorId); // Lấy từ DB

        // Xử lý cập nhật colorName nếu có
        if (request.getColorName() != null &&
            !request.getColorName().equals(color.getColorName())) {

            if (isColorNameExists(request.getColorName())) {
                throw new IllegalArgumentException("Tên màu đã tồn tại!");
            }
            color.setColorName(request.getColorName());
        }

        // Xử lý cập nhật colorCode nếu có
        if (request.getColorCode() != null &&
            !request.getColorCode().equals(color.getColorCode())) {
            color.setColorCode(request.getColorCode());
        }

        return colorRepository.save(color);
    }


    // Xóa màu
    public void deleteColor(Integer colorId) {
        colorRepository.deleteById(colorId);
    }
}
