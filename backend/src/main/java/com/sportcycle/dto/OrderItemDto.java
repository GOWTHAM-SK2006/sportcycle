package com.sportcycle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private Long id;
    private Long productId;
    private String productTitle;
    private String productImage;
    private String selectedSize;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
}

