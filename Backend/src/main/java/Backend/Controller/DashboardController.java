package Backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import Backend.Response.ApiResponse;
import Backend.Response.DashboardResponse;
import Backend.Response.MonthlyRevenueResponse;
import Backend.Service.DashboardService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasAnyAuthority('ROLE_Admin', 'ROLE_Manager', 'ROLE_Super_Admin')")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    public ResponseEntity<DashboardResponse> getOverview() {
        DashboardResponse response = dashboardService.getDashboardOverview();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<MonthlyRevenueResponse>> getMonthlyRevenue() {
        return ResponseEntity.ok(dashboardService.getMonthlyRevenue());
    }

    @GetMapping("/statistics/monthly")
    public ResponseEntity<?> getMonthlyStats(@RequestParam int year) {
        List<Object[]> result = dashboardService.getMonthlyStats(year);
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Đã lấy số liệu thống kê đon hàng hàng tháng thành công", result));
    }

    @GetMapping("/statistics/yearly")
    public ResponseEntity<?> getYearlyStats() {
        List<Object[]> result = dashboardService.getYearlyStats();
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Đã lấy số liệu thống kê đon hàng hàng năm thành công", result));
    }

    @GetMapping("/statistics/weekly")
    public ResponseEntity<?> getWeeklyStats(@RequestParam int year) {
        List<Object[]> result = dashboardService.getWeeklyStats(year);
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Đã lấy số liệu thống kê đon hàng hàng tuần thành công", result));
    }

    @GetMapping("/payment-methods")
    public ResponseEntity<?> getPaymentMethodStats() {
        List<Object[]> result = dashboardService.getPaymentMethodStats();
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Đã lấy số liệu thống kê phương thức thanh toán thành công", result));
    }

    @GetMapping("/order-statuses")
    public ResponseEntity<?> getOrderStatusStats() {
        List<Object[]> result = dashboardService.getOrderStatusStats();
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Đã lấy số liệu thống kê trạng thái đơn hàng thành công", result));
    }
}
