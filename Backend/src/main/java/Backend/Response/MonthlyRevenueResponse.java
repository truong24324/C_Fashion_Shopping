package Backend.Response;

import java.math.BigDecimal;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRevenueResponse {
    private int year;
    private int month;
    private BigDecimal revenue;

}