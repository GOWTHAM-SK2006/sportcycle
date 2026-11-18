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
public class CartItemDto {
    private Long id;
    private Long productId;
    private String productTitle;
    private String productSlug;
    private String productImage;
    private BigDecimal unitPrice;
    private Integer quantity;
    private String selectedSize;
    private BigDecimal totalPrice;
    private Boolean inStock;
    private Integer availableStock;
}

