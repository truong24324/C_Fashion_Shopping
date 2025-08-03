package Backend.Domain.Promotion.Service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import Backend.Domain.Accounts.Repository.AccountRepository;
import Backend.Domain.Order.Repository.OrderRepository;
import Backend.Domain.Promotion.DTO.Response.DashboardResponse;
import Backend.Domain.Promotion.DTO.Response.MonthlyRevenueResponse;
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
                newCustomersToday);
    }

    public List<MonthlyRevenueResponse> getMonthlyRevenue() {
        return orderRepository.getMonthlyRevenue();
    }

    public List<Object[]> getMonthlyStats(int year) {
        return orderRepository.countOrdersByMonth(year);
    }

    public List<Object[]> getYearlyStats() {
        return orderRepository.countOrdersByYear();
    }

    public List<Object[]> getWeeklyStats(int year) {
        return orderRepository.countOrdersByWeek(year);
    }

    public List<Object[]> getPaymentMethodStats() {
        return orderRepository.countOrdersByPaymentMethod();
    }

    public List<Object[]> getOrderStatusStats() {
        return orderRepository.getOrderStatusStatistics();
    }

}