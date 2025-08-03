package Backend.Domain.Product.DTO.Request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class BrandRequest {

    @NotBlank(message = "Tên thương hiệu không được để trống!")
    @Pattern(regexp = "^(?!\\d)[\\p{L}0-9 ]+$", message = "Tên thương hiệu không hợp lệ! (Không được bắt đầu bằng số, chỉ chứa chữ, số và dấu cách)")
    private String brandName;

    private MultipartFile file;

    public BrandRequest(String brandName, MultipartFile file) {
        this.brandName = brandName;
        this.file = file;
    }

}
