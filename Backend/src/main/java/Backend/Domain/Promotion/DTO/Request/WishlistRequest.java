package Backend.Domain.Promotion.DTO.Request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WishlistRequest {

    @NotNull(message = "ID tài khoản không được để trống")
    private Integer accountId;

    @NotNull(message = "ID sản phẩm không được để trống")
    private Integer productId;
}
