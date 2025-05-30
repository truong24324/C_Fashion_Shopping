package Backend.Service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import Backend.Repository.AccountRepository;
import Backend.Repository.OrderRepository;
import Backend.Response.DashboardResponse;
import Backend.Response.MonthlyRevenueResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final AccountRepository accountRepository;

    public DashboardResponse getDashboardOverview() {
        BigDecimal revenue = orderRepository.getTotalRevenue();
        Long orderCount = orderRepository.getTotalOrderCount();
        List<String> topProducts = orderRepository.getBestSellingProduct();
        Long newCustomersToday = accountRepository.countNewAccountsToday();

        return new DashboardResponse(
            revenue,
            orderCount,
            topProducts.isEmpty() ? "Không có" : topProducts.get(0),
            newCustomersToday
        );
    }

    public List<MonthlyRevenueResponse> getMonthlyRevenue() {
    return orderRepository.getMonthlyRevenue();
}

}

