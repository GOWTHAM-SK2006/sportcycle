package com.sportcycle.dto;

import com.sportcycle.entity.enums.SellerType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SellerRegisterRequest {

    @NotBlank(message = "Business name is required")
    private String businessName;

    private SellerType sellerType = SellerType.INDIVIDUAL;

    private String gstin;

    private String panNumber;

    @NotBlank(message = "Contact phone is required")
    private String phone;

    private String bio;

    private String bankAccountNumber;

    private String bankIfsc;
}

