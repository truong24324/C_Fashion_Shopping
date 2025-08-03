package Backend.Domain.Order.DTO.Request;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CartDetailRequest {
    private Integer accountId;
    private Integer variantId; // Thay đổi từ productId thành variantId
    private int quantity;
    private BigDecimal price; // Optional, có thể tính từ Variant nếu cần
    private String color;
    private String size;
    private String material;

}
