package Backend.Service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import Backend.Model.Order;
import Backend.Model.OrderDetail;
import Backend.Repository.OrderRepository;
import Backend.Request.OrderRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public Order placeOrder(OrderRequest request) {
        Order order = new Order();
        order.setAccount(request.getAccount());
        order.setFullName(request.getFullName());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus("Pending");

        List<OrderDetail> details = request.getOrderItems().stream().map(item -> {
            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProductName(item.getProductName());
            detail.setVariantType(item.getVariantType());
            detail.setVariantValue(item.getVariantValue());
            detail.setProductPrice(item.getProductPrice());
            detail.setQuantity(item.getQuantity());
            detail.setTotalPrice(item.getProductPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return detail;
        }).toList();

        order.setOrderDetails(details);
        return orderRepository.save(order);
    }

    public Order findById(Integer id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order save(Order order) {
        return orderRepository.save(order);
    }

}
