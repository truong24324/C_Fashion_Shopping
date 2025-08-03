package Backend.Domain.Order.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Domain.Order.Entity.OrderHistory;


@Repository
public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Integer> {

    // Lấy toàn bộ lịch sử theo đơn hàng
    //List<OrderHistory> findByOrder_OrderIdOrderByUpdatedAtDesc(Integer orderId);
}
