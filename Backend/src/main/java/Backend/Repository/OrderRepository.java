package Backend.Repository;

import java.util.*;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByOrderCode(String orderCode);
    List<Order> findByAccountAccountIdAndDiscountCodeAndPaymentStatus(Integer accountId, String discountCode, String paymentStatus);
    Page<Order> findByOrderStatus_StatusId(Integer statusId, Pageable pageable);

}
