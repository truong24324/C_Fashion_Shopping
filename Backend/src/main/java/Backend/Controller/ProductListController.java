package Backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Backend.Response.ProductCardResponse;
import Backend.Response.ProductDetailResponse;
import Backend.Response.ProductSuggestResponse;
import Backend.Service.ProductService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/views")
@RequiredArgsConstructor
public class ProductListController {

    private final ProductService productService;

    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailResponse> getProductDetail(@PathVariable Integer productId) {
        ProductDetailResponse response = productService.getProductDetail(productId);
        return ResponseEntity.ok(response);
    }

    //Hiển thị danh sách 50 sản phẩm mới nhất
    @GetMapping("/latest")
    public ResponseEntity<List<ProductCardResponse>> getLatestProducts() {
        List<ProductCardResponse> products = productService.getLatestProducts();
        return ResponseEntity.ok(products);
    }

    //Hiển thị gợi ý sản phẩm để mua
    @GetMapping("/suggest")
    public ResponseEntity<List<ProductSuggestResponse>> getProductsSuggest() {
        List<ProductSuggestResponse> products = productService.getProductsSuggest();
        return ResponseEntity.ok(products);
    }
}
