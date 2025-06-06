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

  List<OrderDetail> findAllByOrder_PaymentStatusIn(List<String> paymentStatuses);

  List<OrderDetail> findAllByOrder_Account_AccountId(Long accountId);

  List<OrderDetail> findByOrder(Order order);

  @Query("SELECT new Backend.Response.TopSellingProductNameResponse(p.productId, p.productName, COALESCE(SUM(od.quantity), 0)) "
      +
      "FROM Product p LEFT JOIN OrderDetail od ON od.product.productId = p.productId " +
      "GROUP BY p.productId, p.productName " +
      "ORDER BY COALESCE(SUM(od.quantity), 0) DESC")
  List<TopSellingProductNameResponse> findTopSellingProductsByName();

}
