package Backend.Request;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class OrderItemRequest {
    private String productName;
    private String variantType;
    private String variantValue;
    private BigDecimal productPrice;
    private Integer quantity;
}
