package Backend.Service;

import Backend.Model.Account;
import Backend.Model.Order;
import Backend.Model.OrderDetail;
import Backend.Model.OrderStatus;
import Backend.Request.OrderRequest;
import lombok.RequiredArgsConstructor;
import Backend.Repository.AccountRepository;

import Backend.Repository.OrderRepository;
import Backend.Repository.OrderStatusRepository;
import Backend.Repository.ProductRepository;
import Backend.Repository.VariantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final ProductRepository productRepository;
    private final VariantRepository variantRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public Order placeOrder(OrderRequest orderRequest) {
        // Lấy trạng thái đơn hàng
        OrderStatus orderStatus = orderStatusRepository.findById(orderRequest.getOrderStatusId())
                .orElseThrow(() -> new IllegalArgumentException("Trạng thái đơn hàng không hợp lệ"));

        // Tạo đơn hàng mới
        Order order = new Order();
        Account account = accountRepository.findById(orderRequest.getAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại"));
        order.setAccount(account); // ✅ đúng
        order.setFullName(orderRequest.getFullName());
        order.setEmail(orderRequest.getEmail());
        order.setPhone(orderRequest.getPhone());
        order.setShippingAddress(orderRequest.getShippingAddress());
        order.setTotalAmount(orderRequest.getTotalAmount());
        order.setOrderStatus(orderStatus);
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setPaymentStatus(orderRequest.getPaymentStatus());
        order.setIsActive(true);
        
        // Lưu đơn hàng vào cơ sở dữ liệu
        Order savedOrder = orderRepository.save(order);

        // Lưu chi tiết đơn hàng
        List<OrderDetail> orderDetails = new ArrayList<>();
        for (OrderRequest.OrderDetailRequest orderDetailRequest : orderRequest.getOrderDetails()) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(savedOrder);

            // Lấy sản phẩm và biến thể từ DB
            orderDetail.setProduct(productRepository.findById(orderDetailRequest.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("ID sản phẩm không hợp lệ")));
            orderDetail.setVariant(variantRepository.findById(orderDetailRequest.getVariantId())
                    .orElseThrow(() -> new IllegalArgumentException("ID biến thể không hợp lệ")));

            orderDetail.setProductName(orderDetailRequest.getProductName());
            orderDetail.setColorName(orderDetailRequest.getColorName());
            orderDetail.setSizeName(orderDetailRequest.getSizeName());
            orderDetail.setMaterialName(orderDetailRequest.getMaterialName());
            orderDetail.setProductPrice(orderDetailRequest.getProductPrice());
            orderDetail.setQuantity(orderDetailRequest.getQuantity());
            orderDetail.setTotalPrice(orderDetailRequest.getProductPrice().multiply(BigDecimal.valueOf(orderDetailRequest.getQuantity())));

            // Thêm chi tiết đơn hàng vào danh sách
            orderDetails.add(orderDetail);
        }

        // Lưu các chi tiết đơn hàng vào cơ sở dữ liệu
        savedOrder.setOrderDetails(orderDetails);
        orderRepository.save(savedOrder);

        return savedOrder;
    }

    public Order findById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng có ID: " + orderId));
    }

    public void save(Order order) {
        orderRepository.save(order);
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    // Bạn có thể thêm các phương thức khác như tìm kiếm đơn hàng theo trạng thái, theo tài khoản, v.v...
}
