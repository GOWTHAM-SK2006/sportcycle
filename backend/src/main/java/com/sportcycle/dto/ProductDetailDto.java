package com.sportcycle.dto;

import com.sportcycle.entity.enums.ProductCondition;
import com.sportcycle.entity.enums.ProductStatus;
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
public class ProductDetailDto {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private Long sportId;
    private String sportName;
    private String sportSlug;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private Long brandId;
    private String brandName;
    private String brandLogoUrl;
    private ProductCondition condition;
    private Boolean isPreOwned;
    private Integer usageDurationMonths;
    private String wearDetails;
    private Boolean isVerified;
    private BigDecimal originalPrice;
    private BigDecimal sellingPrice;

    @com.fasterxml.jackson.annotation.JsonProperty("price")
    public BigDecimal getPrice() {
        return sellingPrice != null ? sellingPrice : originalPrice;
    }
    private Integer discountPercentage;
    private Integer stockQuantity;
    private String sku;
    private String sizes;
    private ProductStatus status;
    private Boolean isFeatured;
    private BigDecimal rating;
    private Integer reviewCount;
    private String location;
    private List<String> imageUrls;
    private SellerSummaryDto seller;
    private ClubSummaryDto club;
    private Instant createdAt;
}

