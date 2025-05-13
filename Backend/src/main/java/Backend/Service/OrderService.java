package Backend.Service;

import Backend.Model.*;
import Backend.Request.OrderRequest;
import Backend.Request.OrderStatusUpdateRequest;
import Backend.Response.OrderResponse;
import lombok.RequiredArgsConstructor;
import Backend.Repository.*;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final VariantRepository variantRepository;
    private final AccountRepository accountRepository;
    private final OrderHistoryRepository orderHistoryRepository;

    @Transactional 
    public Order placeOrder(OrderRequest orderRequest) {
        Integer statusId = orderRequest.getOrderStatusId() != null ? orderRequest.getOrderStatusId() : 1;
        String paymentStatus = orderRequest.getPaymentStatus() != null ? orderRequest.getPaymentStatus() : "Chưa thanh toán";

        OrderStatus orderStatus = orderStatusRepository.findById(statusId)
                .orElseThrow(() -> new IllegalArgumentException("Trạng thái đơn hàng không hợp lệ"));

        Account account = accountRepository.findById(orderRequest.getAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại"));

        Order order = new Order();
        order.setAccount(account);
        order.setFullName(orderRequest.getFullName());
        order.setEmail(orderRequest.getEmail());
        order.setPhone(orderRequest.getPhone());
        order.setShippingAddress(orderRequest.getShippingAddress());
        order.setOrderStatus(orderStatus);
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setPaymentStatus(paymentStatus);
        order.setShippingFee(orderRequest.getShippingFee());
        order.setIsActive(true);

        Random random = new Random(); // Khởi tạo
        String generatedOrderCode = "ORD" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + random.nextInt(1000);
        order.setOrderCode(generatedOrderCode);

        List<OrderDetail> orderDetails = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderRequest.OrderDetailRequest orderDetailRequest : orderRequest.getOrderDetails()) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);

            Variant variant = variantRepository.findById(orderDetailRequest.getVariantId())
                    .orElseThrow(() -> new IllegalArgumentException("ID biến thể không hợp lệ"));

            orderDetail.setVariant(variant);
            orderDetail.setProduct(variant.getProduct());
            orderDetail.setProductName(variant.getProduct().getProductName());
            orderDetail.setColorName(variant.getColor().getColorName());
            orderDetail.setSizeName(variant.getSize().getSizeName());
            orderDetail.setMaterialName(variant.getMaterial().getMaterialName());

            orderDetail.setProductPrice(orderDetailRequest.getProductPrice());
            orderDetail.setQuantity(orderDetailRequest.getQuantity());

            BigDecimal totalPrice = orderDetailRequest.getProductPrice()
                    .multiply(BigDecimal.valueOf(orderDetailRequest.getQuantity()));
            orderDetail.setTotalPrice(totalPrice);

            totalAmount = totalAmount.add(totalPrice);
            orderDetails.add(orderDetail);
        }

        // Tính tổng: tổng sản phẩm + phí ship (nếu có)
        if (order.getShippingFee() != null) {
            totalAmount = totalAmount.add(order.getShippingFee());
        }

        order.setTotalAmount(totalAmount);
        order.setOrderDetails(orderDetails);

        return orderRepository.save(order);
    }
    
    public OrderResponse convertToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setFullName(order.getFullName());
        response.setEmail(order.getEmail());
        response.setPhone(order.getPhone());
        response.setShippingAddress(order.getShippingAddress());
        response.setTotalAmount(order.getTotalAmount());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setOrderStatus(order.getOrderStatus().getStatusName());

        List<OrderResponse.OrderDetailResponse> detailResponses = new ArrayList<>();
        for (OrderDetail detail : order.getOrderDetails()) {
            OrderResponse.OrderDetailResponse d = new OrderResponse.OrderDetailResponse();
            d.setVariantId(detail.getVariant().getVariantId());
            d.setProductName(detail.getProductName());
            d.setColorName(detail.getColorName());
            d.setSizeName(detail.getSizeName());
            d.setMaterialName(detail.getMaterialName());
            d.setProductPrice(detail.getProductPrice());
            d.setQuantity(detail.getQuantity());
            d.setTotalPrice(detail.getTotalPrice());
            detailResponses.add(d);
        }

        response.setOrderDetails(detailResponses);
        return response;
    }


    public Order findById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng có ID: " + orderId));
    }

    public void save(Order order) {
        orderRepository.save(order);
    }
    
    public Page<OrderResponse> findByStatusWithPaging(Integer statusId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
        Page<Order> orders;

        if (statusId != null) {
            orders = orderRepository.findByOrderStatus_StatusId(statusId, pageable);
        } else {
            orders = orderRepository.findAll(pageable);
        }

        return orders.map(this::toOrderResponse);
    }

    public Order updateOrderStatus(Integer orderId, OrderStatusUpdateRequest request) {
        Order order = findById(orderId);
        OrderStatus status = orderStatusRepository.findById(request.getStatusId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái"));

        order.setOrderStatus(status);
        order.setUpdatedAt(LocalDateTime.now());

        OrderHistory history = new OrderHistory();
        history.setOrder(order);
        history.setOrderStatus(status);
        history.setNote(request.getNote());
        history.setUpdatedAt(LocalDateTime.now());
        orderHistoryRepository.save(history);

        return orderRepository.save(order);
    }
    
    public OrderResponse toOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();

        response.setOrderId(order.getOrderId());
        response.setFullName(order.getFullName());
        response.setEmail(order.getEmail());
        response.setPhone(order.getPhone());
        response.setShippingAddress(order.getShippingAddress());
        response.setTotalAmount(order.getTotalAmount());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setOrderStatus(order.getOrderStatus().getStatusName());

        // Convert orderDetails to OrderDetailResponse
        List<OrderResponse.OrderDetailResponse> detailResponses = order.getOrderDetails()
            .stream()
            .map(detail -> {
                OrderResponse.OrderDetailResponse res = new OrderResponse.OrderDetailResponse();
                res.setVariantId(detail.getVariant().getVariantId());
                res.setProductName(detail.getProductName());
                res.setColorName(detail.getColorName());
                res.setSizeName(detail.getSizeName());
                res.setMaterialName(detail.getMaterialName());
                res.setProductPrice(detail.getProductPrice());
                res.setQuantity(detail.getQuantity());
                res.setTotalPrice(detail.getTotalPrice());
                return res;
            }).toList();

        response.setOrderDetails(detailResponses);
        return response;
    }

}
