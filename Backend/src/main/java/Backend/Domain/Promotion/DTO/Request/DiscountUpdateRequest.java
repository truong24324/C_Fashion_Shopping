package Backend.Domain.Promotion.DTO.Request;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import Backend.Domain.Promotion.Entity.DiscountApplyType;
import Backend.Domain.Promotion.Entity.DiscountType;
import Backend.Shared.CustomDeserializer.CustomDoubleDeserializer;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DiscountUpdateRequest {

    @Size(min = 3, max = 20, message = "Mã giảm giá phải từ 3 đến 20 ký tự")
    @Pattern(regexp = "^[\\S]+$", message = "Mã giảm giá không được chứa khoảng trắng")
    private String discountCode;

    @JsonDeserialize(using = CustomDoubleDeserializer.class) // Áp dụng custom deserializer
    private Double discountValue; // nhận chuỗi có thể chứa ký tự không hợp lệ

    private DiscountType discountType;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDate;

    @Positive(message = "Số lượng phải lớn hơn 0")
    private Integer quantity;

    
    private Integer maxUsagePerUser;

    private Double minOrderAmount;

    private DiscountApplyType discountApplyType;

    private String description;

    private Boolean isActive;

    public void sanitizeDiscountValue() {
        if (discountValue != null) {
            String cleaned = discountValue.toString().replaceAll("[^\\d.]", "");
            try {
                this.discountValue = Double.parseDouble(cleaned);

                if (discountValue.toString().contains("%")) {
                    this.discountType = DiscountType.PERCENT;
                } else {
                    this.discountType = DiscountType.AMOUNT;
                }
            } catch (NumberFormatException e) {
                this.discountValue = null;
            }
        }
    }
}
