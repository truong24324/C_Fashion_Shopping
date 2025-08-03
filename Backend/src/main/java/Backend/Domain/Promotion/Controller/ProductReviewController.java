package Backend.Domain.Promotion.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import Backend.Domain.Accounts.DTO.Response.ApiResponse;
import Backend.Domain.Accounts.Entity.Account;
import Backend.Domain.Accounts.Repository.AccountRepository;
import Backend.Domain.Order.Service.OrderService;
import Backend.Domain.Product.DTO.Response.PurchasedProductResponse;
import Backend.Domain.Product.Service.ProductReviewService;
import Backend.Domain.Promotion.DTO.Request.ProductReviewRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ProductReviewController {

	private final AccountRepository accountRepository;
    private final OrderService orderService;
	private final ProductReviewService productReviewService;

	@PostMapping("/submit")
	public ResponseEntity<ApiResponse<Object>> submitReview(
	        @RequestPart("review") ProductReviewRequest request,
	        @RequestPart(value = "image", required = false) MultipartFile image,
	        @AuthenticationPrincipal UserDetails userDetails) {

	    String email = userDetails.getUsername();
	    Account account = accountRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

	    productReviewService.addOrUpdateReview(request, image, account);
	    return ResponseEntity.ok(new ApiResponse<>(true, "Đánh giá đã được lưu", null));
	}

	@DeleteMapping("/delete/{reviewId}")
	//@PreAuthorize("hasRole('ROLE_CUSTOMER')")
	public ResponseEntity<ApiResponse<Object>> deleteReview(
	        @PathVariable Integer reviewId,
	        @AuthenticationPrincipal UserDetails userDetails) {

	    String email = userDetails.getUsername();
	    Account account = accountRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

	    productReviewService.deleteReview(reviewId, account.getAccountId());
	    return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa đánh giá", null));
	}

	  @GetMapping("/completed")
	    public ResponseEntity<List<PurchasedProductResponse>> getCompletedPurchases(
	            @RequestParam Long accountId
	    ) {
	        List<PurchasedProductResponse> purchases = orderService.getCompletedPurchasedProducts(accountId);
	        return ResponseEntity.ok(purchases);
	    }

	  @GetMapping("/detail")
	  public ResponseEntity<?> getReviewDetail(
	          @RequestParam Integer orderDetailId,
	          @AuthenticationPrincipal UserDetails userDetails) {

	      String email = userDetails.getUsername();
	      Account account = accountRepository.findByEmail(email)
	              .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

	      var review = productReviewService.getReviewDetailByOrderDetailId(orderDetailId, account.getAccountId());
	      return ResponseEntity.ok(review);
	  }

}
