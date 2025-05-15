package Backend.Repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import Backend.Model.OrderDetail;
import Backend.Response.PurchasedProductResponse;
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
    List<OrderDetail> findAllByOrder_Account_AccountId(Long accountId);

    @Query("""
            SELECT new package Backend.Response.PurchasedProductResponse(
                od.orderDetailId,
                p.productId,
                p.productName,
                od.colorName,
                od.sizeName,
                od.materialName,
                od.productPrice,
                od.quantity,
                (SELECT pi.imageUrl FROM ProductImage pi WHERE pi.product = p AND pi.imageType = 'MAIN'),
                (EXISTS (
                    SELECT 1 FROM ProductReview pr
                    WHERE pr.orderDetail = od AND pr.account.accountId = :accountId
                ))
            )
            FROM OrderDetail od
            JOIN od.order o
            JOIN od.product p
            WHERE o.account.accountId = :accountId
              AND o.orderStatus.statusName = 'Hoàn thành'
              AND o.paymentStatus = 'Đã thanh toán'
        """)
        List<PurchasedProductResponse> findCompletedPurchasedProductsByAccount_AccountId(@Param("accountId") Long accountId);
}
