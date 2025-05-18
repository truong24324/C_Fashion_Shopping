package Backend.Service;

import Backend.Model.*;
import Backend.Repository.*;
import Backend.Request.ProductReviewRequest;
import Backend.Response.ProductReviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductReviewService {

	private final ProductReviewRepository reviewRepository;
	private final OrderDetailRepository orderDetailRepository;

	public ProductReview addOrUpdateReview(ProductReviewRequest request, MultipartFile image, Account account) {
	    OrderDetail orderDetail = orderDetailRepository.findById(request.getOrderDetailId())
	            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng chi tiết"));

	    // Tìm review đã tồn tại theo account + orderDetail
	    Optional<ProductReview> existingReviewOpt = reviewRepository.findByOrderDetail_OrderDetailIdAndAccount_AccountId(
	            request.getOrderDetailId(), account.getAccountId());

	    ProductReview review = existingReviewOpt.orElseGet(ProductReview::new);

	    review.setAccount(account);
	    review.setOrderDetail(orderDetail);
	    review.setProduct(orderDetail.getProduct());
	    review.setVariant(orderDetail.getVariant());
	    review.setRating(request.getRating());
	    review.setTitle(request.getTitle());
	    review.setContent(request.getContent());
	    review.setIsVisible(true);
	    review.setCreatedAt(LocalDateTime.now());

	    return reviewRepository.save(review);
	}

	public ProductReviewResponse getReviewDetailByOrderDetailId(Integer orderDetailId, Long accountId) {
	    ProductReview review = reviewRepository
	            .findByOrderDetail_OrderDetailIdAndAccount_AccountId(orderDetailId, accountId)
	            .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));

	    return ProductReviewResponse.builder()
	            .reviewId(review.getReviewId())
	            .rating(review.getRating())
	            .title(review.getTitle())
	            .content(review.getContent())
	            .build();
	}

	public void deleteReview(Integer reviewId, Long accountId) {
	    ProductReview review = reviewRepository.findById(reviewId)
	            .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá"));

	    if (!review.getAccount().getAccountId().equals(accountId)) {
	        throw new RuntimeException("Không có quyền xóa đánh giá này");
	    }

	    reviewRepository.delete(review);
	}

}
