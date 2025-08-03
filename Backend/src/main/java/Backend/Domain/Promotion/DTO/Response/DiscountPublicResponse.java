package Backend.Domain.Promotion.DTO.Response;

import lombok.Data;

@Data
public class DiscountPublicResponse {
    private String discountCode;
    private String description;
}
