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
public class SellerStatsDto {
    private long totalListings;
    private long activeListings;
    private long pendingApproval;
    private long soldProducts;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private BigDecimal averageRating;
}

