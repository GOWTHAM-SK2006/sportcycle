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
public class AdminStatsDto {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private long totalCustomers;
    private long totalSellers;
    private long totalProducts;
    private long activeListings;
    private long pendingApprovals;
    private long totalClubs;
    private long preOwnedProducts;
}

