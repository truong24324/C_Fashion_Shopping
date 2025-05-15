package Backend.Controller;

import Backend.Model.*;
import Backend.Repository.*;
import Backend.Request.ProductReviewRequest;
import Backend.Response.ProductReviewResponse;
import Backend.Response.PurchasedProductResponse;
import Backend.Service.OrderService;
import Backend.Response.ApiResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ProductReviewController {

    private final ProductReviewRepository reviewRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final AccountRepository accountRepository;
    private final ProductRepository productRepository;
    private final VariantRepository variantRepository;
    private final OrderService orderService;

    // ✅ 1. Tạo đánh giá mới
    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('ROLE_Customer')")
    public ResponseEntity<?> createReview(@RequestBody ProductReviewRequest request) {
        Optional<OrderDetail> orderDetailOpt = orderDetailRepository.findById(request.getOrderDetailId());
        Optional<Account> accountOpt = accountRepository.findById(request.getAccountId());
        Optional<Product> productOpt = productRepository.findById(request.getProductId());
        Optional<Variant> variantOpt = variantRepository.findById(request.getVariantId());

        if (orderDetailOpt.isEmpty() || accountOpt.isEmpty() || productOpt.isEmpty() || variantOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Dữ liệu không hợp lệ", null));
        }

        ProductReview review = new ProductReview();
        review.setOrderDetail(orderDetailOpt.get());
        review.setAccount(accountOpt.get());
        review.setProduct(productOpt.get());
        review.setVariant(variantOpt.get());
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setContent(request.getContent());
        review.setImageUrl(request.getImageUrl());
        review.setIsVisible(true);
        review.setCreatedAt(java.time.LocalDateTime.now());

        reviewRepository.save(review);

        return ResponseEntity.ok(new ApiResponse<>(true, "Đánh giá thành công", toResponse(review)));
    }

    @GetMapping("/completed")
    public ResponseEntity<List<PurchasedProductResponse>> getCompletedPurchases(
            @RequestParam("accountId") Long accountId
    ) {
        List<PurchasedProductResponse> purchases = orderService.getCompletedPurchasedProducts(accountId);
        return ResponseEntity.ok(purchases);
    }
    // ✅ 2. Cập nhật đánh giá
    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_Customer')")
    public ResponseEntity<?> updateReview(@PathVariable Integer id, @RequestBody ProductReviewRequest request) {
        return reviewRepository.findById(id).map(review -> {
            review.setTitle(request.getTitle());
            review.setContent(request.getContent());
            review.setRating(request.getRating());
            review.setImageUrl(request.getImageUrl());
            review.setUpdatedAt(java.time.LocalDateTime.now());
            reviewRepository.save(review);
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật thành công", toResponse(review)));
        }).orElseGet(() -> ResponseEntity.status(404).body(new ApiResponse<>(false, "Không tìm thấy đánh giá", null)));
    }

    // ✅ 3. Ẩn / hiện đánh giá
    @PatchMapping("/visibility/{id}")
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    public ResponseEntity<?> toggleVisibility(@PathVariable Integer id, @RequestParam boolean visible) {
        return reviewRepository.findById(id).map(review -> {
            review.setIsVisible(visible);
            reviewRepository.save(review);
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật hiển thị đánh giá thành công", toResponse(review)));
        }).orElseGet(() -> ResponseEntity.status(404).body(new ApiResponse<>(false, "Không tìm thấy đánh giá", null)));
    }

    // ✅ 4. Lấy tất cả đánh giá theo sản phẩm
    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getReviewsByProduct(@PathVariable Integer productId) {
        List<ProductReview> reviews = reviewRepository.findByProduct_ProductIdAndIsVisibleTrue(productId);
        List<ProductReviewResponse> responses = reviews.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // ✅ Helper: convert entity -> response DTO
    private ProductReviewResponse toResponse(ProductReview review) {
        ProductReviewResponse response = new ProductReviewResponse();
        response.setReviewId(review.getReviewId());
        response.setAccountId(review.getAccount().getAccountId());
        response.setProductId(review.getProduct().getProductId());
        response.setVariantId(review.getVariant().getVariantId());
        response.setRating(review.getRating());
        response.setTitle(review.getTitle());
        response.setContent(review.getContent());
        response.setImageUrl(review.getImageUrl());
        response.setIsVisible(review.getIsVisible());
        response.setCreatedAt(review.getCreatedAt());
        return response;
    }
}
