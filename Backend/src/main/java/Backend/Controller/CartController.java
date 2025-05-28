package Backend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Backend.Model.Variant;
import Backend.Repository.VariantRepository;
import Backend.Request.CartDetailRequest;
import Backend.Response.ApiResponse;
import Backend.Response.CartItemResponse;
import Backend.Service.CartService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasAnyAuthority('ROLE_Customer')")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final VariantRepository variantRepository;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<String>> addToCart(@RequestBody CartDetailRequest request) {
        try {
            String message = cartService.addToCart(request);
            return ResponseEntity.ok(new ApiResponse<>(true, message, null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/update")
    public ResponseEntity<ApiResponse<String>> updateCartDetail(@RequestBody CartDetailRequest request) {
        try {
            String message = cartService.updateCartDetail(request.getAccountId(), request.getVariantId(), request.getQuantity());
            return ResponseEntity.ok(new ApiResponse<>(true, message, null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/find")
    public ResponseEntity<?> findVariantId(
            @RequestParam Integer productId,
            @RequestParam String color,
            @RequestParam String size,
            @RequestParam String material) {

        // Tìm biến thể theo productId và các thuộc tính
        Variant variant = variantRepository.findByProductAndAttributes(productId, color, size, material)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể phù hợp"));

        // Trả về thông tin variant bao gồm stock và variantId
        Map<String, Object> response = new HashMap<>();
        response.put("variantId", variant.getVariantId());
        response.put("stock", variant.getStock());  // Lấy stock từ variant
        response.put("price", variant.getPrice());

        return ResponseEntity.ok(response);  // Trả về map chứa variantId và stock
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromCart(
            @RequestParam Integer accountId,
            @RequestParam Integer variantId) {
        String message = cartService.removeCartItem(accountId, variantId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{accountId}/views")
    public ResponseEntity<List<CartItemResponse>> getCartItems(@PathVariable Integer accountId) {
        List<CartItemResponse> cartItems = cartService.getCartItems(accountId);
        return ResponseEntity.ok(cartItems);
    }
}
