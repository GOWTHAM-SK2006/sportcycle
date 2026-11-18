package com.sportcycle.dto;

import com.sportcycle.entity.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusHistoryDto {
    private Long id;
    private OrderStatus status;
    private String notes;
    private String updatedBy;
    private Instant createdAt;
}

