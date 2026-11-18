package com.sportcycle.dto;

import com.sportcycle.entity.enums.ProductCondition;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductFilterCriteria {
    private String query;
    private String sportSlug;
    private String categorySlug;
    private String brandSlug;
    private ProductCondition condition;
    private Boolean isPreOwned;
    private Boolean isVerified;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean inStockOnly;
    private String sortBy = "recommended"; // recommended, priceAsc, priceDesc, newest, popularity
    private int page = 0;
    private int size = 12;
}

