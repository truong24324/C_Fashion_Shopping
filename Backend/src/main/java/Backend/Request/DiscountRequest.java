package Backend.Request;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import Backend.Model.DiscountType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DiscountRequest {

    @NotBlank(message = "Mã giảm giá không được để trống")
    @Size(min = 3, max = 20, message = "Mã giảm giá phải từ 3 đến 20 ký tự")
    @Pattern(regexp = "^[\\S]+$", message = "Mã giảm giá không được chứa khoảng trắng")
    private String discountCode;

    @NotNull(message = "Giá trị giảm giá không được để trống")
    @Positive(message = "Giá trị giảm giá phải lớn hơn 0")
    private Double discountValue;

    @NotNull(message = "Loại giảm giá không được để trống")
    private DiscountType discountType;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDate;

    @NotNull(message = "Số lượng không được để trống")
    @Positive(message = "Số lượng phải lớn hơn 0")
    private Integer quantity;

    private Integer maxUsagePerUser;

    private Double minOrderAmount;

    @Size(min= 6, max = 255, message = "Mô tả không được dưới 6 ký tự và không vượt quá 255 ký tự")
    private String description;

    private Boolean isActive;

    @AssertTrue(message = "Ngày bắt đầu phải từ hôm nay trở đi và ngày kết thúc phải lớn hơn ngày bắt đầu")
    public boolean isDateRangeValid() {
        LocalDateTime now = LocalDateTime.now();
        return (startDate == null || !startDate.isBefore(now))
            && (endDate == null || startDate == null || endDate.isAfter(startDate));
    }
}
