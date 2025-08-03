package Backend.Domain.Promotion.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import Backend.Domain.Order.Entity.OrderDetail;
import Backend.Domain.Promotion.Entity.ProductReview;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Integer> {
    List<ProductReview> findByProduct_ProductIdAndIsVisibleTrue(Integer productId);

    Optional<ProductReview> findByOrderDetail_OrderDetailId(Integer orderDetailId);

    boolean existsByOrderDetailAndAccount_AccountId(OrderDetail orderDetail, Long accountId);

    boolean existsByOrderDetail_OrderDetailId(Integer orderDetailId);

    Optional<ProductReview> findByOrderDetail_OrderDetailIdAndAccount_AccountId(Integer orderDetailId, Long accountId);

}
