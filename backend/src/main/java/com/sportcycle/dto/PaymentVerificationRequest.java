package com.sportcycle.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentVerificationRequest {

    @NotBlank(message = "Order number is required")
    private String orderNumber;

    @NotBlank(message = "Gateway order ID is required")
    private String gatewayOrderId;

    @NotBlank(message = "Gateway payment ID is required")
    private String gatewayPaymentId;

    @NotBlank(message = "Signature is required")
    private String gatewaySignature;
}

