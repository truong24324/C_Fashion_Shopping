package Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Backend.Model.Order;
import Backend.Model.OrderDetail;


@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
	List<OrderDetail> findAllByOrder_PaymentStatus(String paymentStatus);

    List<OrderDetail> findAllByOrder_Account_AccountId(Long accountId);

    List<OrderDetail> findByOrder(Order order);

}
