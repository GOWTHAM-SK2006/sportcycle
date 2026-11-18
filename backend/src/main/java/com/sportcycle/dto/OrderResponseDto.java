package com.sportcycle.dto;

import com.sportcycle.entity.enums.OrderStatus;
import com.sportcycle.entity.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String recipientName;
    private String phone;
    private String street;
    private String landmark;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal shippingAmount;
    private BigDecimal finalAmount;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private String trackingNumber;
    private String shippingCarrier;
    private String cancellationReason;
    private List<OrderItemDto> items;
    private List<OrderStatusHistoryDto> statusHistory;
    private Instant createdAt;
    private Instant updatedAt;
}

