package com.sportcycle.service;

import com.sportcycle.dto.*;
import com.sportcycle.entity.*;
import com.sportcycle.entity.enums.NotificationType;
import com.sportcycle.entity.enums.OrderStatus;
import com.sportcycle.entity.enums.PaymentStatus;
import com.sportcycle.entity.enums.ProductStatus;
import com.sportcycle.exception.BadRequestException;
import com.sportcycle.exception.InsufficientStockException;
import com.sportcycle.exception.ResourceNotFoundException;
import com.sportcycle.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    @Transactional
    public OrderResponseDto createOrderFromCart(CheckoutRequest request, User user) {
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Your shopping cart is empty"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your shopping cart is empty");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItemsToSave = new ArrayList<>();

        // Validate stock and re-verify live pricing for every item
        for (CartItem ci : cartItems) {
            Product p = ci.getProduct();
            if (p.getStatus() != ProductStatus.ACTIVE) {
                throw new BadRequestException("Product '" + p.getTitle() + "' is no longer active");
            }
            if (p.getStockQuantity() < ci.getQuantity()) {
                throw new InsufficientStockException("Insufficient stock for product '" + p.getTitle() +
                        "'. Only " + p.getStockQuantity() + " available.");
            }

            BigDecimal unitPrice = p.getSellingPrice();
            BigDecimal itemTotal = unitPrice.multiply(new BigDecimal(ci.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            // Deduct stock
            p.setStockQuantity(p.getStockQuantity() - ci.getQuantity());
            if (p.getStockQuantity() == 0) {
                p.setStatus(ProductStatus.SOLD_OUT);
            }
            productRepository.save(p);

            String img = (p.getImages() != null && !p.getImages().isEmpty()) ?
                    p.getImages().get(0).getImageUrl() : null;

            orderItemsToSave.add(OrderItem.builder()
                    .product(p)
                    .productTitle(p.getTitle())
                    .productImage(img)
                    .selectedSize(ci.getSelectedSize())
                    .quantity(ci.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(itemTotal)
                    .build());
        }

        BigDecimal shipping = subtotal.compareTo(new BigDecimal("999")) >= 0 ? BigDecimal.ZERO : new BigDecimal("99.00");
        BigDecimal discount = BigDecimal.ZERO;
        BigDecimal finalAmount = subtotal.add(shipping).subtract(discount);

        String orderNumber = "SC-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .recipientName(request.getRecipientName())
                .phone(request.getPhone())
                .street(request.getStreet())
                .landmark(request.getLandmark())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .country(request.getCountry() != null ? request.getCountry() : "India")
                .status(OrderStatus.PENDING)
                .totalAmount(subtotal)
                .discountAmount(discount)
                .shippingAmount(shipping)
                .finalAmount(finalAmount)
                .paymentStatus(PaymentStatus.PENDING)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "RAZORPAY")
                .build();

        Order savedOrder = orderRepository.save(order);

        for (OrderItem oi : orderItemsToSave) {
            oi.setOrder(savedOrder);
        }
        orderItemRepository.saveAll(orderItemsToSave);
        savedOrder.setItems(orderItemsToSave);

        // Record initial status history
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(savedOrder)
                .status(OrderStatus.PENDING)
                .notes("Order placed by customer")
                .updatedBy("CUSTOMER")
                .build();
        statusHistoryRepository.save(history);

        // Clear user's cart
        cartItemRepository.deleteByCartId(cart.getId());

        // Notify user
        notificationService.createNotification(
                user,
                "Order Placed Successfully",
                "Order #" + orderNumber + " placed for ₹" + finalAmount + ". Proceed to payment.",
                NotificationType.ORDER,
                "/orders/" + orderNumber
        );

        auditService.log(user.getEmail(), "CREATE_ORDER", "Order", savedOrder.getId().toString(), null, "Created order " + orderNumber);

        return mapToOrderDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public PagedResponse<OrderResponseDto> getUserOrders(User user, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), size > 0 ? size : 10, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        return PagedResponse.<OrderResponseDto>builder()
                .content(orderPage.getContent().stream().map(this::mapToOrderDto).collect(Collectors.toList()))
                .page(orderPage.getNumber())
                .size(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public OrderResponseDto getOrderByNumber(String orderNumber, User user) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName()));
        if (!order.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new ResourceNotFoundException("Order not found");
        }

        return mapToOrderDto(order);
    }

    @Transactional
    public OrderResponseDto cancelOrder(Long orderId, String reason, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName()));
        if (!order.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new ResourceNotFoundException("Order not found");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order cannot be cancelled at status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(reason);
        Order updated = orderRepository.save(order);

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product p = item.getProduct();
            p.setStockQuantity(p.getStockQuantity() + item.getQuantity());
            if (p.getStatus() == ProductStatus.SOLD_OUT) {
                p.setStatus(ProductStatus.ACTIVE);
            }
            productRepository.save(p);
        }

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(updated)
                .status(OrderStatus.CANCELLED)
                .notes("Order cancelled. Reason: " + reason)
                .updatedBy(user.getEmail())
                .build();
        statusHistoryRepository.save(history);

        notificationService.createNotification(
                order.getUser(),
                "Order Cancelled",
                "Order #" + order.getOrderNumber() + " was cancelled successfully.",
                NotificationType.ORDER,
                "/orders/" + order.getOrderNumber()
        );

        auditService.log(user.getEmail(), "CANCEL_ORDER", "Order", order.getId().toString(), null, "Cancelled order " + order.getOrderNumber());

        return mapToOrderDto(updated);
    }

    @Transactional
    public OrderResponseDto updateOrderStatus(Long orderId, UpdateOrderStatusRequest request, String updatedBy) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(request.getStatus());
        if (request.getTrackingNumber() != null) order.setTrackingNumber(request.getTrackingNumber());
        if (request.getShippingCarrier() != null) order.setShippingCarrier(request.getShippingCarrier());

        Order updated = orderRepository.save(order);

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(updated)
                .status(request.getStatus())
                .notes(request.getNotes())
                .updatedBy(updatedBy)
                .build();
        statusHistoryRepository.save(history);

        notificationService.createNotification(
                order.getUser(),
                "Order Status Update: " + request.getStatus(),
                "Your order #" + order.getOrderNumber() + " is now " + request.getStatus() +
                        (request.getTrackingNumber() != null ? ". Tracking: " + request.getTrackingNumber() : ""),
                NotificationType.ORDER,
                "/orders/" + order.getOrderNumber()
        );

        return mapToOrderDto(updated);
    }

    public OrderResponseDto mapToOrderDto(Order o) {
        List<OrderItemDto> itemDtos = o.getItems().stream()
                .map(i -> OrderItemDto.builder()
                        .id(i.getId())
                        .productId(i.getProduct().getId())
                        .productTitle(i.getProductTitle())
                        .productImage(i.getProductImage())
                        .selectedSize(i.getSelectedSize())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .totalPrice(i.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        List<OrderStatusHistoryDto> historyDtos = o.getStatusHistory() != null ?
                o.getStatusHistory().stream()
                        .map(h -> OrderStatusHistoryDto.builder()
                                .id(h.getId())
                                .status(h.getStatus())
                                .notes(h.getNotes())
                                .updatedBy(h.getUpdatedBy())
                                .createdAt(h.getCreatedAt())
                                .build())
                        .collect(Collectors.toList()) :
                List.of();

        return OrderResponseDto.builder()
                .id(o.getId())
                .orderNumber(o.getOrderNumber())
                .userId(o.getUser().getId())
                .recipientName(o.getRecipientName())
                .phone(o.getPhone())
                .street(o.getStreet())
                .landmark(o.getLandmark())
                .city(o.getCity())
                .state(o.getState())
                .postalCode(o.getPostalCode())
                .country(o.getCountry())
                .status(o.getStatus())
                .totalAmount(o.getTotalAmount())
                .discountAmount(o.getDiscountAmount())
                .shippingAmount(o.getShippingAmount())
                .finalAmount(o.getFinalAmount())
                .paymentStatus(o.getPaymentStatus())
                .paymentMethod(o.getPaymentMethod())
                .trackingNumber(o.getTrackingNumber())
                .shippingCarrier(o.getShippingCarrier())
                .cancellationReason(o.getCancellationReason())
                .items(itemDtos)
                .statusHistory(historyDtos)
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }
}

