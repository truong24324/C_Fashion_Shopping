package Backend.Request;

import java.math.BigDecimal;
import java.util.List;

import Backend.Model.Account;
import lombok.Data;

@Data
public class OrderRequest {
    private Account account;
    private String fullName;
    private String email;
    private String phone;
    private String shippingAddress;
    private String paymentMethod;
    private BigDecimal totalAmount;
    private List<OrderItemRequest> orderItems;
}
