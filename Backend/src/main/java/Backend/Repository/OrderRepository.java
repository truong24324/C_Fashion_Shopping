package Backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByOrderCode(String orderCode);
    List<Order> findByAccountAccountIdAndDiscountCodeAndPaymentStatus(Integer accountId, String discountCode, String paymentStatus);
    Page<Order> findByOrderStatus_StatusId(Integer statusId, Pageable pageable);
    List<Order> findAllByAccount_AccountIdAndOrderStatus_StatusNameAndPaymentStatus(
            Long accountId, String statusName, String paymentStatus
    );
}
