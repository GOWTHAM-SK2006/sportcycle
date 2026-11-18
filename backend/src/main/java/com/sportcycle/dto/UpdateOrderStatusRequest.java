package com.sportcycle.dto;

import com.sportcycle.entity.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotNull(message = "Order status is required")
    private OrderStatus status;

    private String notes;

    private String trackingNumber;

    private String shippingCarrier;
}

