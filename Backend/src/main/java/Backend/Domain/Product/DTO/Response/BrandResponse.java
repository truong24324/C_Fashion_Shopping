package Backend.Domain.Product.DTO.Response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BrandResponse {
    private Integer brandId;

    @NotBlank(message = "Tên thương hiệu không được để trống!")
    @Pattern(regexp = "^(?!\\d)[\\p{L}0-9 ]+$", message = "Tên thương hiệu không hợp lệ! (Không được bắt đầu bằng số, chỉ chứa chữ, số và dấu cách)")
    private String brandName;
    private String logo;
}
