package com.sportcycle.dto;

import com.sportcycle.entity.enums.SellerType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerDto {
    private Long id;
    private Long userId;
    private String businessName;
    private SellerType sellerType;
    private Boolean isVerified;
    private String gstin;
    private String panNumber;
    private String phone;
    private String bio;
    private BigDecimal rating;
    private Integer totalSales;
    private Instant createdAt;
}

