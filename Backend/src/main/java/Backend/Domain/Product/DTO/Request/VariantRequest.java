package Backend.Domain.Product.DTO.Request;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VariantRequest {

    @NotNull(message = "Product ID không được để trống")
    private Integer productId;

    private Integer color;
    private Integer size;
    private Integer material;

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Min(value = 0, message = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")
    private Integer stock;

    @NotNull(message = "Giá không được để trống")
    @Min(value = 0, message = "Giá phải lớn hơn hoặc bằng 0")
    private BigDecimal price;
}
