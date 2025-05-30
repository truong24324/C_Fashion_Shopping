package Backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import Backend.Model.Account;
import Backend.Repository.AccountRepository;
import Backend.Request.ProductReviewRequest;
import Backend.Response.ApiResponse;
import Backend.Response.PurchasedProductResponse;
import Backend.Service.OrderService;
import Backend.Service.ProductReviewService;
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
