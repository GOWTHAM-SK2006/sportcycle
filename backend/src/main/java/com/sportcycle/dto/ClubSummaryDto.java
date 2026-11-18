package com.sportcycle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubSummaryDto {
    private Long id;
    private String name;
    private String slug;
    private String location;
    private String city;
    private String state;
    private String logoUrl;
    private Boolean isVerified;
    private Boolean membershipOpen;
}

