package Backend.Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "ORDERS")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ORDER_ID")
    private Integer orderId;

    @Column(name = "ORDER_CODE", nullable = false, length = 255)
    private String orderCode;

    // Liên kết tài khoản
    @ManyToOne
    @JoinColumn(name = "ACCOUNT_ID", nullable = false)
    private Account account;

    // Thông tin khách hàng
    @Column(name = "FULLNAME", nullable = false, length = 255)
    private String fullName;

    @Column(name = "EMAIL", length = 100)
    private String email;

    @Column(name = "PHONE", length = 15)
    private String phone;

    @Column(name = "SHIPPING_ADDRESS", length = 255)
    private String shippingAddress;

    // Thông tin đơn hàng
    @Column(name = "ORDER_DATE")
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(name = "TOTAL_AMOUNT", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "SHIPPING_FEE", precision = 18, scale = 2)
    private BigDecimal shippingFee;

    // Thanh toán
    @Column(name = "PAYMENT_METHOD", length = 50)
    private String paymentMethod;

    @Column(name = "PAYMENT_STATUS", nullable = false)
    private String paymentStatus;

    // Trạng thái đơn hàng
    @ManyToOne
    @JoinColumn(name = "ORDER_STATUS_ID", nullable = false)
    private OrderStatus orderStatus;

    // Giảm giá
    @ManyToOne
    @JoinColumn(name = "DISCOUNT_ID")
    private Discount discount;

    @Column(name = "DISCOUNT_CODE")
    private String discountCode;

    // Trạng thái và thời gian
    @Column(name = "IS_ACTIVE")
    private Boolean isActive = true;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Chi tiết đơn hàng
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails;
}
