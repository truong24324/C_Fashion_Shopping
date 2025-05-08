package Backend.Response;

import java.math.BigDecimal;
import java.util.List;

import Backend.Model.*;
import lombok.Data;

@Data
public class CartItemResponse {
    private String productName;
    private String variantDetails; // VD: "Xám, 2XL, Cotton"
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
    private String productImage;
    private List<String> availableColors;
    private List<String> availableSizes;
    private List<String> availableMaterials;
    private Integer variantId;

    public CartItemResponse(CartDetail cartDetail) {
        Variant variant = cartDetail.getVariant();
        Product product = variant.getProduct();

        this.productName = product.getProductName();
        this.variantDetails = variant.getColor().getColorName() + ", "
                            + variant.getSize().getSizeName() + ", "
                            + variant.getMaterial().getMaterialName();

        this.quantity = cartDetail.getQuantity();
        this.price = cartDetail.getPrice();
        this.totalPrice = price.multiply(BigDecimal.valueOf(quantity));
        this.variantId = variant.getVariantId();

        // Lấy ảnh chính
        this.productImage = product.getImages().stream()
                .filter(img -> img.getImageType() == ImageType.MAIN)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(null);

        // Lấy danh sách các biến thể (color/size/material)
        this.availableColors = product.getVariants().stream()
                .map(v -> v.getColor().getColorName())
                .distinct()
                .toList();

        this.availableSizes = product.getVariants().stream()
                .map(v -> v.getSize().getSizeName())
                .distinct()
                .toList();

        this.availableMaterials = product.getVariants().stream()
                .map(v -> v.getMaterial().getMaterialName())
                .distinct()
                .toList();
    }
}
