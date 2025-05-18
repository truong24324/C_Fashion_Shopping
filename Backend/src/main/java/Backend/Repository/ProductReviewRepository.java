package Backend.Repository;

import Backend.Model.OrderDetail;
import Backend.Model.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Integer> {
    List<ProductReview> findByProduct_ProductIdAndIsVisibleTrue(Integer productId);
    Optional<ProductReview> findByOrderDetail_OrderDetailId(Integer orderDetailId);
    boolean existsByOrderDetailAndAccount_AccountId(OrderDetail orderDetail, Long accountId);
    boolean existsByOrderDetail_OrderDetailId(Integer orderDetailId);
Optional<ProductReview> findByOrderDetail_OrderDetailIdAndAccount_AccountId(Integer orderDetailId, Long accountId);

}
