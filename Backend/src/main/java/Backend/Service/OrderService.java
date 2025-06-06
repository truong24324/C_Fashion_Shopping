package Backend.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Backend.Model.*;
import Backend.Repository.*;
import Backend.Request.OrderRequest;
import Backend.Response.OrderDetailResponse;
import Backend.Response.OrderResponse;
import Backend.Response.PurchasedProductResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final VariantRepository variantRepository;
    private final AccountRepository accountRepository;
    private final OrderHistoryRepository orderHistoryRepository;
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductReviewRepository productReviewRepository;

    @Transactional
    public Order placeOrder(OrderRequest orderRequest) {
        Integer statusId = orderRequest.getOrderStatusId() != null ? orderRequest.getOrderStatusId() : 1;
        String paymentStatus = orderRequest.getPaymentStatus() != null ? orderRequest.getPaymentStatus()
                : "Chưa thanh toán";

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
        String generatedOrderCode = "ORD" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + random.nextInt(1000);
        order.setOrderCode(generatedOrderCode);

        List<OrderDetail> orderDetails = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // Lấy các variant đã đặt
        List<Variant> orderedVariants = new ArrayList<>();

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

            // Lưu các variant đã đặt
            orderedVariants.add(variant);
        }

        order.setTotalAmount(totalAmount);
        order.setOrderDetails(orderDetails);

        Order savedOrder = orderRepository.save(order);

        List<OrderDetail> details = orderDetailRepository.findByOrder(order);
        for (OrderDetail detail : details) {
            Variant variant = detail.getVariant();
            if (variant.getStock() < detail.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + variant.getVariantId() + " không đủ tồn kho");
            }
            variant.setStock(variant.getStock() - detail.getQuantity());
            variantRepository.save(variant);
        }

        // Xóa các CartDetail liên quan đến các variant đã đặt trong giỏ hàng
        Cart cart = cartRepository.findByAccount(account)
                .orElseThrow(() -> new IllegalArgumentException("Giỏ hàng không tồn tại cho tài khoản này"));

        for (Variant variant : orderedVariants) {
            cartDetailRepository.deleteByCartAndVariant(cart, variant);
        }

        return savedOrder;
    }

    public OrderResponse convertToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderCode(order.getOrderCode());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedOrderDate = order.getOrderDate() != null ? order.getOrderDate().format(formatter) : null;
        response.setOrderDate(formattedOrderDate);
        response.setFullName(order.getFullName());
        response.setEmail(order.getEmail());
        response.setPhone(order.getPhone());
        response.setShippingAddress(order.getShippingAddress());
        response.setTotalAmount(order.getTotalAmount());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setOrderStatus(order.getOrderStatus().getStatusName());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setShippingFee(order.getShippingFee());
        DateTimeFormatter formatters = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        String formattedDate = order.getCreatedAt()
                .atZone(ZoneId.systemDefault())
                .withZoneSameInstant(ZoneId.of("Asia/Ho_Chi_Minh"))
                .format(formatters);

        response.setOrderDate(formattedDate); // String field

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

    public Page<OrderResponse> findByStatusWithPaging(Integer statusId, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "orderDate")); // ASC: tăng dần
        Page<Order> orders;

        if (statusId != null) {
            orders = orderRepository.findByOrderStatus_StatusId(statusId, pageable);
        } else {
            orders = orderRepository.findAll(pageable);
        }

        return orders.map(this::toOrderResponse);
    }

    public Order updateOrderToNextStep(Integer orderId) {
        Order order = findById(orderId);
        OrderStatus currentStatus = order.getOrderStatus();

        // Lấy bước tiếp theo dựa trên stepOrder
        OrderStatus nextStatus = orderStatusRepository
                .findFirstByStepOrder(currentStatus.getStepOrder() + 1)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bước tiếp theo"));

        if (currentStatus.getIsFinal()) {
            throw new RuntimeException("Trạng thái hiện tại đã là cuối cùng");
        }

        order.setOrderStatus(nextStatus);

        order.setUpdatedAt(LocalDateTime.now());
        if (nextStatus.getStatusName().equals("Giao thành công")) {
            order.setPaymentStatus("Đã thanh toán");
        } else {
            order.setPaymentStatus(null);
        }

        OrderHistory history = new OrderHistory();
        history.setOrder(order);
        history.setOrderStatus(nextStatus);
        // Cập nhật note ghi rõ trạng thái cũ và trạng thái mới
        history.setNote("Chuyển từ trạng thái '" + currentStatus.getStatusName() + "' sang trạng thái '"
                + nextStatus.getStatusName() + "'");
        history.setUpdatedAt(LocalDateTime.now());
        orderHistoryRepository.save(history);

        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Integer orderId) {
        Order order = findById(orderId);

        if (!order.getOrderStatus().getIsCancellable()) {
            throw new RuntimeException("Trạng thái hiện tại không thể hủy!");
        }

        // ✅ Cộng lại số lượng tồn kho
        List<OrderDetail> details = orderDetailRepository.findByOrder(order);
        for (OrderDetail detail : details) {
            Variant variant = detail.getVariant();
            variant.setStock(variant.getStock() + detail.getQuantity());
            variantRepository.save(variant);
        }

        // ✅ Cập nhật trạng thái "Đã hủy"
        OrderStatus cancelStatus = orderStatusRepository.findByStatusNameIgnoreCase("Đã hủy")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái 'Đã hủy'"));

        order.setOrderStatus(cancelStatus);
        order.setUpdatedAt(LocalDateTime.now());

        // ✅ Ghi lịch sử hủy đơn
        OrderHistory history = new OrderHistory();
        history.setOrder(order);
        history.setOrderStatus(cancelStatus);
        history.setNote("Đơn hàng bị hủy");
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

        String statusName = order.getOrderStatus().getStatusName();

        response.setOrderStatus(statusName);
        response.setPaymentStatus(order.getPaymentStatus());
        response.setShippingFee(order.getShippingFee());
        response.setOrderCode(order.getOrderCode());
        // Convert LocalDateTime to String before setting order date
        LocalDateTime createdAt = order.getCreatedAt();
        String formattedCreatedAt = createdAt != null
                ? createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                : null;
        response.setOrderDate(formattedCreatedAt);

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

    public Order updateStatusByUser(Integer orderId, Long accountId, String targetStatusName) {
        Order order = findById(orderId);

        if (!order.getAccount().getAccountId().equals(accountId)) {
            throw new RuntimeException("Bạn không có quyền cập nhật đơn hàng này");
        }

        OrderStatus currentStatus = order.getOrderStatus();

        OrderStatus targetStatus = orderStatusRepository.findByStatusNameIgnoreCase(targetStatusName)
                .orElseThrow(() -> new RuntimeException("Trạng thái không hợp lệ"));

        List<String> cancelableStatuses = List.of("Chờ xác nhận", "Đang xử lý", "Đang chuẩn bị hàng");

        if (targetStatusName.equalsIgnoreCase("Đã hủy")) {
            if (!cancelableStatuses.contains(currentStatus.getStatusName())) {
                throw new RuntimeException(
                        "Chỉ có thể hủy đơn khi đang trong trạng thái: " + String.join(", ", cancelableStatuses));
            }
        } else if (List.of("Yêu cầu trả hàng", "Hoàn thành").contains(targetStatusName)) {
            if (!currentStatus.getStatusName().equalsIgnoreCase("Giao thành công")) {
                throw new RuntimeException("Chỉ có thể chuyển sang '" + targetStatusName + "' sau khi Giao thành công");
            }
        } else {
            throw new RuntimeException("Bạn không được phép chuyển sang trạng thái này");
        }

        OrderStatus oldStatus = currentStatus;
        order.setOrderStatus(targetStatus);
        order.setUpdatedAt(LocalDateTime.now());

        OrderHistory history = new OrderHistory();
        history.setOrder(order);
        history.setOrderStatus(targetStatus);
        history.setNote(
                "Người dùng chuyển từ '" + oldStatus.getStatusName() + "' sang '" + targetStatus.getStatusName() + "'");
        history.setUpdatedAt(LocalDateTime.now());
        orderHistoryRepository.save(history);

        return orderRepository.save(order);
    }

    public List<OrderDetail> getAllPurchasedProductsByAccount(Long accountId) {
        return orderDetailRepository.findAllByOrder_Account_AccountId(accountId);
    }

    public OrderDetailResponse toOrderDetailResponse(OrderDetail detail) {
        OrderDetailResponse res = new OrderDetailResponse();
        res.setProductName(detail.getProductName());
        res.setColorName(detail.getColorName());
        res.setSizeName(detail.getSizeName());
        res.setMaterialName(detail.getMaterialName());
        res.setProductPrice(detail.getProductPrice());
        res.setQuantity(detail.getQuantity());
        res.setTotalPrice(detail.getTotalPrice());

        // ✅ Thêm orderId và orderStatus
        res.setOrderId(detail.getOrder().getOrderId());
        res.setOrderStatus(detail.getOrder().getOrderStatus().getStatusName());

        // ✅ Thêm ảnh sản phẩm chính
        List<ProductImage> images = detail.getProduct().getImages();
        if (images != null && !images.isEmpty()) {
            ProductImage mainImg = images.stream()
                    .filter(img -> ImageType.MAIN.equals(img.getImageType()))
                    .findFirst()
                    .orElse(images.get(0));
            res.setProductImageUrl(mainImg.getImageUrl());
        }

        return res;
    }

    public List<PurchasedProductResponse> getCompletedPurchasedProducts(Long accountId) {
        List<PurchasedProductResponse> responseList = new ArrayList<>();

        // 1. Lấy tất cả đơn hàng hoàn thành và đã thanh toán của người dùng
        List<Order> completedOrders = orderRepository
                .findAllByAccount_AccountIdAndOrderStatus_StatusNameAndPaymentStatus(
                        accountId, "Hoàn thành", "Đã thanh toán");

        // 2. Duyệt từng OrderDetail trong mỗi đơn hàng
        for (Order order : completedOrders) {
            for (OrderDetail od : order.getOrderDetails()) {
                Product product = od.getProduct();

                // 3. Lấy hình ảnh MAIN nếu có
                String mainImageUrl = product.getImages().stream()
                        .filter(img -> img.getImageType() == ImageType.MAIN)
                        .map(ProductImage::getImageUrl)
                        .findFirst()
                        .orElse(null);

                // 4. Kiểm tra đã đánh giá chưa
                boolean reviewed = productReviewRepository.existsByOrderDetailAndAccount_AccountId(od, accountId);

                // 5. Tạo DTO
                PurchasedProductResponse dto = new PurchasedProductResponse(
                        od.getOrderDetailId(),
                        product.getProductId(),
                        product.getProductName(),
                        od.getColorName(),
                        od.getSizeName(),
                        od.getMaterialName(),
                        od.getProductPrice(),
                        od.getQuantity(),
                        mainImageUrl,
                        reviewed);

                responseList.add(dto);
            }
        }

        return responseList;
    }

    public Optional<Order> findByOrderCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode);
    }

}