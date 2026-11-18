package com.sportcycle.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClubCreateRequest {

    @NotBlank(message = "Club name is required")
    private String name;

    private Long sportId;

    @NotBlank(message = "Location address is required")
    private String location;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    private String description;

    private String logoUrl;

    private String bannerUrl;

    private String contactEmail;

    private String contactPhone;

    private Boolean membershipOpen = true;
}

