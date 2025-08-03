package Backend.Domain.Order.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Domain.Order.Entity.OrderStatus;


@Repository
public interface OrderStatusRepository extends JpaRepository<OrderStatus, Integer> {
    Optional<OrderStatus> findByStatusName(String statusName);
    Optional<OrderStatus> findByStepOrder(Integer stepOrder);
    Optional<OrderStatus> findFirstByStepOrder(Integer stepOrder);
    Optional<OrderStatus> findByStatusNameIgnoreCase(String statusName);

}
