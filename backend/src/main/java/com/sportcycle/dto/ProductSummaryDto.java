package com.sportcycle.dto;

import com.sportcycle.entity.enums.ProductCondition;
import com.sportcycle.entity.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryDto {
    private Long id;
    private String title;
    private String slug;
    private String brandName;
    private String sportName;
    private String sportSlug;
    private String categoryName;
    private String categorySlug;
    private ProductCondition condition;
    private Boolean isPreOwned;
    private Boolean isVerified;
    private BigDecimal originalPrice;
    private BigDecimal sellingPrice;
    private Integer discountPercentage;
    private Integer stockQuantity;
    private ProductStatus status;
    private Boolean isFeatured;
    private BigDecimal rating;
    private Integer reviewCount;
    private String primaryImageUrl;
    private String location;
    private String sizes;
}

