package Backend.Domain.Product.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Backend.Domain.Accounts.DTO.Response.ApiResponse;
import Backend.Domain.Product.DTO.Response.BrandResponse;
import Backend.Domain.Product.DTO.Response.ProductCardResponse;
import Backend.Domain.Product.DTO.Response.ProductDetailResponse;
import Backend.Domain.Product.DTO.Response.ProductOverviewResponse;
import Backend.Domain.Product.DTO.Response.ProductSuggestResponse;
import Backend.Domain.Product.DTO.Response.TopSellingProductNameResponse;
import Backend.Domain.Product.DTO.Response.TopSellingProductResponse;
import Backend.Domain.Product.Entity.Brand;
import Backend.Domain.Product.Service.BrandService;
import Backend.Domain.Product.Service.ProductService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/views")
@RequiredArgsConstructor
public class ProductListController {

	private final ProductService productService;
	private final BrandService brandService;

	@GetMapping("/by-name/{productName}")
	public ResponseEntity<ApiResponse<ProductDetailResponse>> getProductDetailByName(@PathVariable String productName) {
		ProductDetailResponse response = productService.getProductDetailByName(productName);
		return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết sản phẩm thành công!", response));
	}

	@GetMapping("/latest")
	public ResponseEntity<ApiResponse<List<ProductCardResponse>>> getLatestProducts() {
		List<ProductCardResponse> products = productService.getLatestProducts();
		return ResponseEntity.ok(new ApiResponse<>(true, "Lấy sản phẩm mới nhất thành công!", products));
	}

	@GetMapping("/suggest")
	public ResponseEntity<ApiResponse<List<ProductSuggestResponse>>> getProductsSuggest() {
		List<ProductSuggestResponse> products = productService.getProductsSuggest();
		return ResponseEntity.ok(new ApiResponse<>(true, "Lấy gợi ý sản phẩm thành công!", products));
	}

	@GetMapping("/overview")
	public ResponseEntity<ApiResponse<List<ProductOverviewResponse>>> getProductOverviews() {
		return ResponseEntity.ok(
				new ApiResponse<>(true, "Lấy tổng quan sản phẩm thành công!", productService.getAllProductOverviews()));
	}

	@GetMapping("/listBrand")
	public ResponseEntity<ApiResponse<List<BrandResponse>>> getAllBrandsNoPagination() {
		List<Brand> brands = brandService.getAllBrands();
		List<BrandResponse> brandResponses = brands.stream()
				.map(brand -> new BrandResponse(brand.getBrandId(), brand.getBrandName(), brand.getLogo()))
				.collect(Collectors.toList());

		return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách thương hiệu thành công!", brandResponses));
	}

	@GetMapping("/top-selling")
	public ResponseEntity<ApiResponse<List<TopSellingProductResponse>>> getTopSellingProducts() {
		return ResponseEntity.ok(new ApiResponse<>(true, "Lấy sản phẩm bán chạy thành công!",
				productService.getTop10BestSellingProducts()));
	}

	@GetMapping("/top-selling-names")
	public ResponseEntity<ApiResponse<List<TopSellingProductNameResponse>>> getTopSellingProductNames() {
		List<TopSellingProductNameResponse> results = productService.getTopSellingProductNames();
		return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách sản phẩm bán chạy thành công!", results));
	}
}