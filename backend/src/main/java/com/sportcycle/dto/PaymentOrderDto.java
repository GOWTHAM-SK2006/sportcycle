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
public class PaymentOrderDto {
    private String orderNumber;
    private String gatewayOrderId;
    private BigDecimal amount;
    private String currency;
    private String keyId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}

