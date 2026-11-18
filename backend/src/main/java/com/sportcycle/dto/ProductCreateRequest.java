package com.sportcycle.dto;

import com.sportcycle.entity.enums.ProductCondition;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductCreateRequest {

    @NotBlank(message = "Product title is required")
    private String title;

    @NotNull(message = "Sport is required")
    private Long sportId;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private Long brandId;

    private Long clubId;

    @NotBlank(message = "Description is required")
    private String description;

    private ProductCondition condition = ProductCondition.BRAND_NEW;

    private Boolean isPreOwned = false;

    private Integer usageDurationMonths = 0;

    private String wearDetails;

    @NotNull(message = "Original price is required")
    @DecimalMin(value = "0.01", message = "Original price must be greater than 0")
    private BigDecimal originalPrice;

    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.01", message = "Selling price must be greater than 0")
    private BigDecimal sellingPrice;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity = 1;

    private String sku;

    private String sizes;

    private String location;

    private List<String> imageUrls;
}

