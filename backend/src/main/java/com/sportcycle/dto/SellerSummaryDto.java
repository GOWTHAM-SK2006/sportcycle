package com.sportcycle.dto;

import com.sportcycle.entity.enums.SellerType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerSummaryDto {
    private Long id;
    private String businessName;
    private SellerType sellerType;
    private Boolean isVerified;
    private BigDecimal rating;
    private Integer totalSales;
    private String phone;
    private String bio;
}

