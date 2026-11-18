package com.sportcycle.dto;

import com.sportcycle.entity.enums.ProductStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductModerationRequest {
    @NotNull(message = "Status is required")
    private ProductStatus status;

    private Boolean isVerified;

    private String reason;
}

