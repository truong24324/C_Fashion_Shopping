package Backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import Backend.Model.Order;
import Backend.Model.OrderDetail;
import Backend.Response.TopSellingProductNameResponse;


@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
	List<OrderDetail> findAllByOrder_PaymentStatus(String paymentStatus);

    List<OrderDetail> findAllByOrder_Account_AccountId(Long accountId);

    List<OrderDetail> findByOrder(Order order);

    @Query("SELECT new Backend.Response.TopSellingProductNameResponse(od.product.productId, od.product.productName, SUM(od.quantity)) " +
       "FROM OrderDetail od GROUP BY od.product.productId, od.product.productName ORDER BY SUM(od.quantity) DESC")
List<TopSellingProductNameResponse> findTopSellingProductsByName();

}

