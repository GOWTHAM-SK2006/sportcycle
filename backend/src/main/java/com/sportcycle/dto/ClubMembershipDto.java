package com.sportcycle.dto;

import com.sportcycle.entity.enums.MembershipStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubMembershipDto {
    private Long id;
    private Long clubId;
    private String clubName;
    private Long userId;
    private String userName;
    private String userEmail;
    private MembershipStatus status;
    private Instant requestedAt;
    private Instant reviewedAt;
    private String notes;
}

