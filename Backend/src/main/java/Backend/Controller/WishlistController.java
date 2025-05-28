package Backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Backend.Model.Account;
import Backend.Model.Wishlist;
import Backend.Repository.AccountRepository;
import Backend.Request.WishlistRequest;
import Backend.Response.ApiResponse;
import Backend.Response.WishlistProductResponse;
import Backend.Response.WishlistResponse;
import Backend.Service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlists")
public class WishlistController {

    private final WishlistService wishlistService;
    private final AccountRepository accountRepository;

    @PatchMapping("/toggle")
    public ResponseEntity<ApiResponse<WishlistResponse>> toggleWishlist(@RequestBody @Valid WishlistRequest request) {
        Wishlist wishlist = wishlistService.toggleWishlist(request);
        String message = wishlist.getIsDeleted() ? "Đã bỏ yêu thích sản phẩm!" : "Đã thêm vào danh sách yêu thích!";
        return ResponseEntity.ok(new ApiResponse<>(true, message, new WishlistResponse(wishlist)));
    }

    @GetMapping
    public ResponseEntity<List<WishlistResponse>> getWishlists(@RequestParam Long accountId) {
        List<WishlistResponse> wishlists = wishlistService.getWishlistedProducts(accountId);
        return ResponseEntity.ok(wishlists);
    }

    @GetMapping("/me")
    public ResponseEntity<List<WishlistProductResponse>> getWishlistProducts(@AuthenticationPrincipal UserDetails userDetails) {
        // Giả sử bạn lưu accountId trong username của JWT
    	String email = userDetails.getUsername();
        Account account = accountRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        List<WishlistProductResponse> wishlist = wishlistService.getWishlistProducts(account.getAccountId());
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/add-to-cart/{productId}")
    public ResponseEntity<ApiResponse<String>> addToCartFromWishlist(
            @PathVariable Integer productId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        wishlistService.addToCartWithLowestVariant(account.getAccountId(), productId);

        return ResponseEntity.ok(new ApiResponse<>(true, "Đã thêm vào giỏ hàng!", null));
    }

}
