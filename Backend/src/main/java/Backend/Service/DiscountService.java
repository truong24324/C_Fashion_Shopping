package Backend.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import Backend.Model.Discount;
import Backend.Model.DiscountType;
import Backend.Repository.DiscountRepository;
import Backend.Request.DiscountRequest;
import Backend.Request.DiscountUpdateRequest;
import Backend.Response.DiscountResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiscountService {

    private final DiscountRepository discountRepository;

    public Page<DiscountResponse> getAllDiscounts(Pageable pageable) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return discountRepository.findAll(pageable).map(discount -> {
            DiscountResponse dto = new DiscountResponse();
            dto.setDiscountId(discount.getDiscountId());
            dto.setDiscountCode(discount.getDiscountCode());

            String valueFormatted = discount.getDiscountType().name().equals("PERCENT")
                    ? discount.getDiscountValue() + " %"
                    : discount.getDiscountValue() + " vnđ";
            dto.setDiscountValue(valueFormatted);

            dto.setIsActive(discount.getIsActive());
            dto.setQuantity(discount.getQuantity());
            dto.setMaxUsagePerUser(discount.getMaxUsagePerUser());
            dto.setMinOrderAmount(discount.getMinOrderAmount());

            dto.setStartDate(discount.getStartDate().format(formatter));
            dto.setEndDate(discount.getEndDate() != null ? discount.getEndDate().format(formatter) : null);
            dto.setDescription(discount.getDescription());

            return dto;
        });
    }

    public List<DiscountResponse> getPublicDiscounts() {
        return discountRepository.findByIsActiveTrue().stream().map(discount -> {
            DiscountResponse dto = new DiscountResponse();
            dto.setDiscountCode(discount.getDiscountCode());
            dto.setDescription(discount.getDescription());
            return dto;
        }).collect(Collectors.toList());
    }

    public Discount createDiscount(@Valid DiscountRequest request) {
        Discount discount = new Discount();
        applyRequestToDiscount(request, discount);
        return discountRepository.save(discount);
    }

    public Discount updateDiscount(Integer discountId, @Valid DiscountUpdateRequest request) {
        // Lấy mã giảm giá hiện tại
        Discount discount = getDiscountById(discountId);

        boolean isUpdated = false;

        // Kiểm tra và cập nhật discountCode nếu có thay đổi
        if (request.getDiscountCode() != null && !request.getDiscountCode().trim().isEmpty()
                && !request.getDiscountCode().equals(discount.getDiscountCode())) {
            discount.setDiscountCode(request.getDiscountCode().trim());
            isUpdated = true;
        }

        // Call sanitizeDiscountValue to process discountValue and set discountType if needed
        request.sanitizeDiscountValue();
        Double newValue = request.getDiscountValue();

        // Kiểm tra và cập nhật discountValue nếu có thay đổi
        if (newValue != null && !newValue.equals(discount.getDiscountValue())) {
            // Validate the value if it's a percentage
            if (request.getDiscountType() == DiscountType.PERCENT && (newValue < 0 || newValue > 100)) {
                throw new IllegalArgumentException("Giá trị phần trăm giảm giá phải trong khoảng 0-100%");
            }
            discount.setDiscountValue(newValue);
            isUpdated = true;
        }

        // Kiểm tra và cập nhật discountType nếu có thay đổi
        if (request.getDiscountType() != null && !request.getDiscountType().equals(discount.getDiscountType())) {
            discount.setDiscountType(request.getDiscountType());
            isUpdated = true;
        }

        // Kiểm tra và cập nhật isActive nếu có thay đổi
        if (request.getIsActive() != null && !request.getIsActive().equals(discount.getIsActive())) {
            discount.setIsActive(request.getIsActive());
            isUpdated = true;
        }

        // Kiểm tra và cập nhật quantity nếu có thay đổi
        if (request.getQuantity() != null && !request.getQuantity().equals(discount.getQuantity())) {
            discount.setQuantity(request.getQuantity());
            isUpdated = true;
        }

        // Kiểm tra và cập nhật maxUsagePerUser nếu có thay đổi
        if (request.getMaxUsagePerUser() != null && !request.getMaxUsagePerUser().equals(discount.getMaxUsagePerUser())) {
            discount.setMaxUsagePerUser(request.getMaxUsagePerUser());
            isUpdated = true;
        }

        // Kiểm tra và cập nhật minOrderAmount nếu có thay đổi
        if (request.getMinOrderAmount() != null && !request.getMinOrderAmount().equals(discount.getMinOrderAmount())) {
            discount.setMinOrderAmount(request.getMinOrderAmount());
            isUpdated = true;
        }

        // Kiểm tra và cập nhật startDate nếu có thay đổi
        if (request.getStartDate() != null && !request.getStartDate().equals(discount.getStartDate())) {
            discount.setStartDate(request.getStartDate());
            isUpdated = true;
        }

        // Kiểm tra và cập nhật endDate nếu có thay đổi
        if (request.getEndDate() != null && !request.getEndDate().equals(discount.getEndDate())) {
            discount.setEndDate(request.getEndDate());
            isUpdated = true;
        }

        // Kiểm tra và cập nhật description nếu có thay đổi
        if (request.getDescription() != null && !request.getDescription().equals(discount.getDescription())) {
            discount.setDescription(request.getDescription());
            isUpdated = true;
        }

        // Nếu không có gì thay đổi, không cần phải lưu lại
        if (!isUpdated) {
            return discount; // Trả lại đối tượng mà không thay đổi gì
        }

        // Cập nhật trường updatedAt tự động
        discount.setUpdatedAt(LocalDateTime.now());

        // Lưu lại nếu có thay đổi
        return discountRepository.save(discount);
    }

    public void deleteDiscount(Integer id) {
        if (!discountRepository.existsById(id)) {
            throw new NoSuchElementException("Không tìm thấy mã giảm giá với ID: " + id);
        }
        discountRepository.deleteById(id);
    }

    public Discount getDiscountById(Integer id) {
        return discountRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy mã giảm giá với ID: " + id));
    }

    public boolean isDiscountCodeExists(String code) {
        return discountRepository.existsByDiscountCode(code);
    }

    private void applyRequestToDiscount(DiscountRequest req, Discount discount) {
        discount.setDiscountCode(req.getDiscountCode());
        discount.setDiscountValue(req.getDiscountValue());
        discount.setDiscountType(req.getDiscountType());
        discount.setIsActive(req.getIsActive());
        discount.setQuantity(req.getQuantity());
        discount.setMaxUsagePerUser(req.getMaxUsagePerUser());
        discount.setMinOrderAmount(req.getMinOrderAmount());
        discount.setStartDate(req.getStartDate());
        discount.setEndDate(req.getEndDate());
        discount.setDescription(req.getDescription());
    }

    public void updateDiscountStatus(Integer discountId, boolean isActive) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã giảm giá"));

        discount.setIsActive(isActive);
        discountRepository.save(discount);
    }
}
