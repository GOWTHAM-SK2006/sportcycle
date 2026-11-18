package com.sportcycle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubDto {
    private Long id;
    private Long adminUserId;
    private String name;
    private String slug;
    private Long sportId;
    private String sportName;
    private String location;
    private String city;
    private String state;
    private String description;
    private String logoUrl;
    private String bannerUrl;
    private String contactEmail;
    private String contactPhone;
    private Boolean membershipOpen;
    private Integer memberCount;
    private Boolean isVerified;
    private Instant createdAt;
}

