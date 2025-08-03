package Backend.Domain.Order.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import Backend.Domain.Accounts.DTO.Response.ApiResponse;
import Backend.Domain.Order.DTO.Request.CartDetailRequest;
import Backend.Domain.Order.DTO.Response.CartItemResponse;
import Backend.Domain.Order.Service.CartService;
import Backend.Domain.Product.Entity.Variant;
import Backend.Domain.Product.Repository.VariantRepository;
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
            String message = cartService.updateCartDetail(request.getAccountId(), request.getVariantId(),
                    request.getQuantity());
            return ResponseEntity.ok(new ApiResponse<>(true, message, null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/find")
    public ResponseEntity<?> findVariantId(
            @RequestParam(required = false) Integer productId,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String material) {

        // Kiểm tra thiếu tham số
        if (productId == null)
            throw new IllegalArgumentException("Thiếu tham số: productId");
        if (color == null || color.isBlank())
            throw new IllegalArgumentException("Thiếu tham số: Màu sắc (color)");
        if (size == null || size.isBlank())
            throw new IllegalArgumentException("Thiếu tham số: Kích thước (size)");
        if (material == null || material.isBlank())
            throw new IllegalArgumentException("Thiếu tham số: Chất liệu (material)");

        Variant variant = variantRepository.findByProductAndAttributes(productId, color, size, material)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể phù hợp"));

        Map<String, Object> response = new HashMap<>();
        response.put("variantId", variant.getVariantId());
        response.put("stock", variant.getStock());
        response.put("price", variant.getPrice());

        return ResponseEntity.ok(response);
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
