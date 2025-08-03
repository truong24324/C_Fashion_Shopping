package Backend.Domain.Promotion.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import Backend.Domain.Accounts.DTO.Response.ApiResponse;
import Backend.Domain.Accounts.Entity.Account;
import Backend.Domain.Accounts.Repository.AccountRepository;
import Backend.Domain.Promotion.DTO.Request.WishlistRequest;
import Backend.Domain.Promotion.DTO.Response.WishlistProductResponse;
import Backend.Domain.Promotion.DTO.Response.WishlistResponse;
import Backend.Domain.Promotion.Entity.Wishlist;
import Backend.Domain.Promotion.Repository.WishlistRepository;
import Backend.Domain.Promotion.Service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlists")
public class WishlistController {

    private final WishlistService wishlistService;
    private final WishlistRepository wishlistRepository;
    private final AccountRepository accountRepository;

    @PatchMapping("/toggle")
    public ResponseEntity<ApiResponse<WishlistResponse>> toggleWishlist(@RequestBody @Valid WishlistRequest request) {
        Wishlist wishlist = wishlistService.toggleWishlist(request);
        String message = wishlist.getIsDeleted() ? "Đã bỏ yêu thích sản phẩm!" : "Đã thêm vào danh sách yêu thích!";
        return ResponseEntity.ok(new ApiResponse<>(true, message, new WishlistResponse(wishlist)));
    }

    // @GetMapping
    // public ResponseEntity<List<WishlistResponse>> getWishlists(@RequestParam Long accountId) {
    //     List<WishlistResponse> wishlists = wishlistService.getWishlistedProducts(accountId);
    //     return ResponseEntity.ok(wishlists);
    // }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistResponse>>> getWishlistsByAccountId(@RequestParam Long accountId) {
        List<Wishlist> wishlists = wishlistRepository.findByAccount_AccountIdAndIsDeletedFalse(accountId);
        List<WishlistResponse> response = wishlists.stream()
                .map(WishlistResponse::new)
                .toList();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách yêu thích thành công!", response));
    }

    @GetMapping("/me")
    public ResponseEntity<List<WishlistProductResponse>> getWishlistProducts(
            @AuthenticationPrincipal UserDetails userDetails) {
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
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        wishlistService.addToCartWithLowestVariant(account.getAccountId(), productId);

        return ResponseEntity.ok(new ApiResponse<>(true, "Đã thêm vào giỏ hàng!", null));
    }

}
