package Backend.Repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import Backend.Model.OrderDetail;
import Backend.Response.TopSellingProductResponse;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
	@Query("""
		    SELECT od.product.productId AS productId, od.product.productName AS productName, SUM(od.quantity) AS totalSold
		    FROM OrderDetail od
		    WHERE od.order.paymentStatus = 'Đã thanh toán'
		    GROUP BY od.product.productId, od.product.productName
		    ORDER BY totalSold DESC
		    """)
		List<TopSellingProductResponse> findTop10BestSellingProducts(Pageable pageable);

}
