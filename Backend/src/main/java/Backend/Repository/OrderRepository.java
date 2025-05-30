package Backend.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import Backend.Model.Order;
import Backend.Response.MonthlyRevenueResponse;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
        Optional<Order> findByOrderCode(String orderCode);

        List<Order> findByAccountAccountIdAndDiscountCodeAndPaymentStatus(Integer accountId, String discountCode,
                        String paymentStatus);

        Page<Order> findByOrderStatus_StatusId(Integer statusId, Pageable pageable);

        List<Order> findAllByAccount_AccountIdAndOrderStatus_StatusNameAndPaymentStatus(
                        Long accountId, String statusName, String paymentStatus);

        // @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.isActive
        // = true")
        // BigDecimal getTotalRevenue();

        @Query("""
                            SELECT COALESCE(SUM(o.totalAmount - COALESCE(o.shippingFee, 0)), 0)
                            FROM Order o
                            WHERE o.isActive = true
                              AND (o.orderStatus.statusName = 'Hoàn thành' OR o.orderStatus.statusName = 'Giao thành công')
                        """)
        BigDecimal getTotalRevenue();

        @Query("SELECT COUNT(o) FROM Order o WHERE o.isActive = true")
        Long getTotalOrderCount();

        @Query("SELECT od.productName FROM OrderDetail od GROUP BY od.productName ORDER BY SUM(od.quantity) DESC")
        List<String> getBestSellingProduct();

        @Query("SELECT new Backend.Response.MonthlyRevenueResponse(MONTH(o.orderDate), YEAR(o.orderDate), SUM(o.totalAmount)) "
                        +
                        "FROM Order o WHERE o.isActive = true GROUP BY MONTH(o.orderDate), YEAR(o.orderDate) " +
                        "ORDER BY YEAR(o.orderDate), MONTH(o.orderDate)")
        List<MonthlyRevenueResponse> getMonthlyRevenue();

}
