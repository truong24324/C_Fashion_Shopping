package Backend.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Backend.Model.Brand;
import Backend.Response.*;
import Backend.Service.BrandService;
import Backend.Service.ProductService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/views")
@RequiredArgsConstructor
public class ProductListController {

	private final ProductService productService;
	private final BrandService brandService;

	@GetMapping("/{productId}")
	public ResponseEntity<ProductDetailResponse> getProductDetail(@PathVariable Integer productId) {
		ProductDetailResponse response = productService.getProductDetail(productId);
		return ResponseEntity.ok(response);
	}

	// Hiển thị danh sách 50 sản phẩm mới nhất
	@GetMapping("/latest")
	public ResponseEntity<List<ProductCardResponse>> getLatestProducts() {
		List<ProductCardResponse> products = productService.getLatestProducts();
		return ResponseEntity.ok(products);
	}

	// Hiển thị gợi ý sản phẩm để mua
	@GetMapping("/suggest")
	public ResponseEntity<List<ProductSuggestResponse>> getProductsSuggest() {
		List<ProductSuggestResponse> products = productService.getProductsSuggest();
		return ResponseEntity.ok(products);
	}

	@GetMapping("/overview")
	public ResponseEntity<List<ProductOverviewResponse>> getProductOverviews() {
		return ResponseEntity.ok(productService.getAllProductOverviews());
	}

	@GetMapping("/listBrand")
	public ResponseEntity<List<BrandResponse>> getAllBrandsNoPagination() {
		List<Brand> brands = brandService.getAllBrands(); // Gọi phương thức trả về List<Brand>

		List<BrandResponse> brandResponses = brands.stream()
				.map(brand -> new BrandResponse(brand.getBrandId(), brand.getBrandName(), brand.getLogo()))
				.collect(Collectors.toList());

		return ResponseEntity.ok(brandResponses);
	}

	@GetMapping("/top-selling")
	public ResponseEntity<List<TopSellingProductResponse>> getTopSellingProducts() {
		return ResponseEntity.ok(productService.getTop10BestSellingProducts());
	}

}
