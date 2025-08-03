package Backend.Domain.Promotion.DTO.Response;

import java.math.BigDecimal;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private String bestSellingProduct;
    private Long newCustomersToday;
}

