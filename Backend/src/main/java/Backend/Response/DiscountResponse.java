package Backend.Response;

import Backend.Model.DiscountApplyType;
import lombok.Data;

@Data
public class DiscountResponse {
	private Integer discountId;
    private String discountCode;
    private String discountValue;
    private Boolean isActive;
    private Integer quantity;
    private DiscountApplyType discountApplyType;
    private Integer maxUsagePerUser;
    private Double minOrderAmount;
    private String startDate;
    private String endDate;
    private String description;
}
