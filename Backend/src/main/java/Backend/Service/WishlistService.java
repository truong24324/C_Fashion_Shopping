package Backend.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import Backend.Model.Account;
import Backend.Model.Cart;
import Backend.Model.CartDetail;
import Backend.Model.Product;
import Backend.Model.Variant;
import Backend.Model.Wishlist;
import Backend.Repository.AccountRepository;
import Backend.Repository.CartDetailRepository;
import Backend.Repository.CartRepository;
import Backend.Repository.ProductRepository;
import Backend.Repository.WishlistRepository;
import Backend.Request.WishlistRequest;
import Backend.Response.WishlistProductResponse;
import Backend.Response.WishlistResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final AccountRepository accountRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;

    // ✅ Kiểm tra sản phẩm đã có trong wishlist chưa
    public boolean isProductInWishlist(Integer accountId, Integer productId) {
        return wishlistRepository.existsByAccount_AccountIdAndProduct_ProductId(accountId, productId);
    }

    // ✅ Thêm sản phẩm vào wishlist
    @Transactional
    public Wishlist addToWishlist(WishlistRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        Wishlist wishlist = new Wishlist();
        wishlist.setAccount(account);
        wishlist.setProduct(product);
        return wishlistRepository.save(wishlist);
    }

    public Wishlist toggleWishlist(WishlistRequest request) {
        Optional<Wishlist> optionalWishlist = wishlistRepository
            .findByAccount_AccountIdAndProduct_ProductId(request.getAccountId(), request.getProductId());

        if (optionalWishlist.isPresent()) {
            Wishlist wishlist = optionalWishlist.get();
            wishlist.setIsDeleted(!wishlist.getIsDeleted()); // toggle
            return wishlistRepository.save(wishlist);
        } else {
            Wishlist newWishlist = new Wishlist();
            newWishlist.setAccount(accountRepository.getReferenceById(request.getAccountId()));
            newWishlist.setProduct(productRepository.getReferenceById(request.getProductId()));
            newWishlist.setIsDeleted(false); // default là "thêm"
            return wishlistRepository.save(newWishlist);
        }
    }

    public List<WishlistResponse> getWishlistedProducts(Long accountId) {
        List<Wishlist> wishlists = wishlistRepository.findByAccount_AccountIdAndIsDeletedFalse(accountId);
        return wishlists.stream()
                .map(WishlistResponse::new)
                .collect(Collectors.toList());
    }

//    // ✅ Xóa sản phẩm khỏi wishlist
//    @Transactional
//    public void deleteWishlist(Integer wishlistId) {
//        if (!wishlistRepository.existsById(wishlistId)) {
//            throw new RuntimeException("Sản phẩm không tồn tại trong danh sách yêu thích");
//        }
//        wishlistRepository.deleteById(wishlistId);
//    }

    public List<WishlistProductResponse> getWishlistProducts(Long accountId) {
        List<Wishlist> wishlists = wishlistRepository.findByAccount_AccountIdAndIsDeletedFalse(accountId);

        return wishlists.stream().map(wishlist -> {
            Product product = wishlist.getProduct();

            // Ảnh chính (loại MAIN)
            String mainImageUrl = product.getImages().stream()
                .filter(img -> img.getImageType().name().equalsIgnoreCase("MAIN"))
                .map(img -> img.getImageUrl())
                .findFirst()
                .orElse(null);

            // Giá thấp nhất
            BigDecimal minPrice = product.getVariants().stream()
                .map(variant -> variant.getPrice())
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

            return new WishlistProductResponse(
                    product.getProductId(),
                    product.getProductName(),
                    mainImageUrl,
                    minPrice
            );
        }).collect(Collectors.toList());
    }

    public void addToCartWithLowestVariant(Long accountId, Integer productId) {
        // 1. Lấy sản phẩm
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // 2. Tìm variant có giá thấp nhất
        Variant lowestVariant = product.getVariants().stream()
            .filter(v -> v.getStock() > 0) // nếu cần kiểm tra tồn kho
            .min(Comparator.comparing(Variant::getPrice))
            .orElseThrow(() -> new RuntimeException("Không có biến thể khả dụng"));

        // 3. Lấy giỏ hàng của người dùng
        Cart cart = cartRepository.findByAccount_AccountId(accountId)
            .orElseGet(() -> {
                Cart newCart = new Cart();
                newCart.setAccount(accountRepository.findByAccountId(accountId).get());
                return cartRepository.save(newCart);
            });

        // 4. Kiểm tra xem variant đã có trong cart chưa
        Optional<CartDetail> existingDetail = cartDetailRepository.findByCartAndVariant(cart, lowestVariant);
        if (existingDetail.isPresent()) {
            CartDetail detail = existingDetail.get();
            detail.setQuantity(detail.getQuantity() + 1);
            cartDetailRepository.save(detail);
        } else {
            CartDetail detail = new CartDetail(cart, lowestVariant, 1, lowestVariant.getPrice());
            cartDetailRepository.save(detail);
        }
    }

}
