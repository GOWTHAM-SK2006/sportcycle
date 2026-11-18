package com.sportcycle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
    private Long id;
    private String recipientName;
    private String phone;
    private String street;
    private String landmark;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private Boolean isDefault;
    private String addressType;
}

