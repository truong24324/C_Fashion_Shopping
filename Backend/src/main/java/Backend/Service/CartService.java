package Backend.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import Backend.Model.Account;
import Backend.Model.Cart;
import Backend.Model.CartDetail;
import Backend.Model.Variant;
import Backend.Repository.AccountRepository;
import Backend.Repository.CartDetailRepository;
import Backend.Repository.CartRepository;
import Backend.Repository.VariantRepository;
import Backend.Request.CartDetailRequest;
import Backend.Response.CartItemResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

	private final CartRepository cartRepository;
	private final CartDetailRepository cartDetailRepository;
	private final VariantRepository variantRepository;
	private final AccountRepository accountRepository;

	public String addToCart(CartDetailRequest request) {

		Account account = accountRepository.findById(request.getAccountId())
				.orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với ID: " + request.getAccountId()));

		Cart cart = cartRepository.findByAccount(account).orElseGet(() -> {
			Cart newCart = new Cart(account);
			return cartRepository.save(newCart);
		});

		Variant variant = variantRepository.findById(request.getVariantId())
				.orElseThrow(() -> new RuntimeException(
						"Không tìm thấy biến thể sản phẩm với ID: " + request.getVariantId()));

		if (variant.getStock() < request.getQuantity()) {
			throw new RuntimeException("Sản phẩm \"" + variant.getProduct().getProductName()
					+ "\" không đủ hàng. Hiện còn lại: " + variant.getStock());
		}

		CartDetail cartDetail = cartDetailRepository.findByCartAndVariant(cart, variant)
				.map(detail -> {
					int newQuantity = detail.getQuantity() + request.getQuantity();
					if (variant.getStock() < newQuantity) {
						throw new RuntimeException("Không thể thêm " + request.getQuantity()
								+ " sản phẩm. Số lượng tồn kho hiện tại là: " + variant.getStock());
					}
					detail.setQuantity(newQuantity);
					return detail;
				})
				.orElseGet(() -> {
					if (variant.getStock() < request.getQuantity()) {
						throw new RuntimeException("Không đủ hàng tồn kho cho sản phẩm \""
								+ variant.getProduct().getProductName() + "\".");
					}
					CartDetail detail = new CartDetail();
					detail.setCart(cart);
					detail.setVariant(variant);
					detail.setQuantity(request.getQuantity());
					detail.setPrice(request.getPrice());
					return detail;
				});

		cartDetailRepository.save(cartDetail);
		cart.setUpdatedAt(LocalDateTime.now());
		cartRepository.save(cart);

		return "✅ Đã thêm sản phẩm vào giỏ hàng: " + variant.getProduct().getProductName() + " (Số lượng: "
				+ request.getQuantity() + ")";
	}

	public String updateCartDetail(Integer accountId, Integer variantId, int quantity) {
		// Kiểm tra tài khoản
		Account account = accountRepository.findById(accountId)
				.orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

		// Lấy Variant theo variantId
		Variant variant = variantRepository.findById(variantId)
				.orElseThrow(() -> new RuntimeException("Variant không tồn tại!"));

		// Kiểm tra số lượng tồn kho
		if (variant.getStock() < quantity) {
			throw new RuntimeException("Số lượng trong kho không đủ để cập nhật!");
		}

		// Lấy giỏ hàng của tài khoản
		Cart cart = cartRepository.findByAccount(account)
				.orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại!"));

		// Tìm CartDetail theo giỏ hàng và variant
		CartDetail cartDetail = cartDetailRepository.findByCartAndVariant(cart, variant)
				.orElseThrow(() -> new RuntimeException("Sản phẩm không có trong giỏ hàng!"));

		// Cập nhật số lượng
		if (quantity == 0) {
			cartDetailRepository.delete(cartDetail);
		} else {
			cartDetail.setQuantity(quantity);
			cartDetailRepository.save(cartDetail);
		}

		// Cập nhật thời gian sửa đổi giỏ hàng
		cart.setUpdatedAt(LocalDateTime.now());
		cartRepository.save(cart);

		return "Cập nhật giỏ hàng thành công!";
	}

	public String removeCartItem(Integer accountId, Integer variantId) {
		// Kiểm tra tài khoản
		Account account = accountRepository.findById(accountId)
				.orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

		// Lấy Variant
		Variant variant = variantRepository.findById(variantId)
				.orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!"));

		// Lấy giỏ hàng
		Cart cart = cartRepository.findByAccount(account)
				.orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại!"));

		// Tìm CartDetail
		CartDetail cartDetail = cartDetailRepository.findByCartAndVariant(cart, variant)
				.orElseThrow(() -> new RuntimeException("Sản phẩm không có trong giỏ hàng!"));

		// Xóa CartDetail
		cartDetailRepository.delete(cartDetail);

		// Cập nhật thời gian giỏ hàng
		cart.setUpdatedAt(LocalDateTime.now());
		cartRepository.save(cart);

		return "Xóa sản phẩm khỏi giỏ hàng thành công!";
	}

	public List<CartDetail> getCartDetails(Integer accountId) {
		Account account = accountRepository.findById(accountId)
				.orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));

		// Lấy giỏ hàng của tài khoản
		Cart cart = cartRepository.findByAccount(account)
				.orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại!"));

		// Trả về danh sách các CartDetail
		return cartDetailRepository.findByCart(cart);
	}

	public List<CartItemResponse> getCartItems(Integer accountId) {
		List<CartDetail> cartDetails = getCartDetails(accountId);
		return cartDetails.stream().map(CartItemResponse::new).collect(Collectors.toList());
	}

	// public void addToCarts(Integer accountId, CartDetailRequest request) {
	// Account account = accountRepository.findById(accountId)
	// .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));
	//
	// Cart cart = cartRepository.findByAccount(account).orElseGet(() -> {
	// Cart newCart = new Cart();
	// newCart.setAccount(account);
	// return cartRepository.save(newCart);
	// });
	//
	// Variant variant = variantRepository.findById(request.getVariantId())
	// .orElseThrow(() -> new RuntimeException("Thực thể không tồn tại"));
	//
	// if (variant.getStock() < request.getQuantity()) {
	// throw new RuntimeException("Sản phẩm không đủ hàng");
	// }
	//
	// CartDetail cartDetail = cartDetailRepository.findByCartAndVariant(cart,
	// variant)
	// .map(detail -> {
	// detail.setQuantity(detail.getQuantity() + request.getQuantity());
	// return detail;
	// })
	// .orElseGet(() -> {
	// CartDetail detail = new CartDetail();
	// detail.setCart(cart);
	// detail.setVariant(variant);
	// detail.setQuantity(request.getQuantity());
	// detail.setPrice(request.getPrice());
	// return detail;
	// });
	//
	// cartDetailRepository.save(cartDetail);
	// }
}
