package Backend.Response;

import java.math.BigDecimal;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRevenueResponse {
    private int month;
    private int year;
    private BigDecimal revenue;

}