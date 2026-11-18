package com.sportcycle.controller;

import com.sportcycle.dto.*;
import com.sportcycle.entity.User;
import com.sportcycle.entity.enums.MembershipStatus;
import com.sportcycle.repository.UserRepository;
import com.sportcycle.security.UserPrincipal;
import com.sportcycle.service.ClubService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clubs")
@RequiredArgsConstructor
@Tag(name = "Sports Clubs", description = "Sports club directory, member requests, and club marketplace")
public class ClubController {

    private final ClubService clubService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    @GetMapping
    @Operation(summary = "Get directory of all verified sports clubs")
    public ResponseEntity<ApiResponse<List<ClubDto>>> getAllClubs() {
        return ResponseEntity.ok(ApiResponse.ok(clubService.getAllClubs()));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get public sports club details by slug")
    public ResponseEntity<ApiResponse<ClubDto>> getClubBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(clubService.getClubBySlug(slug)));
    }

    @GetMapping("/{slug}/products")
    @Operation(summary = "Get gear listed by this sports club")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getClubProducts(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(clubService.getClubProducts(slug)));
    }

    @PostMapping("/{id}/memberships")
    @Operation(summary = "Request membership in a sports club")
    public ResponseEntity<ApiResponse<ClubMembershipDto>> requestMembership(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Interested in playing and academy events") String notes) {
        return ResponseEntity.ok(ApiResponse.ok(clubService.requestMembership(id, notes, getUser(principal)), "Membership requested"));
    }

    @GetMapping("/admin/{clubId}/memberships")
    @PreAuthorize("hasAnyAuthority('ROLE_CLUB_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "List membership requests for club administration")
    public ResponseEntity<ApiResponse<List<ClubMembershipDto>>> getMemberships(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long clubId) {
        return ResponseEntity.ok(ApiResponse.ok(clubService.getClubMemberships(clubId, getUser(principal))));
    }

    @PatchMapping("/admin/{clubId}/memberships/{membershipId}")
    @PreAuthorize("hasAnyAuthority('ROLE_CLUB_ADMIN', 'ROLE_ADMIN')")
    @Operation(summary = "Approve or reject a club membership request")
    public ResponseEntity<ApiResponse<ClubMembershipDto>> reviewMembership(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long clubId,
            @PathVariable Long membershipId,
            @RequestParam MembershipStatus status) {
        return ResponseEntity.ok(ApiResponse.ok(clubService.reviewMembership(clubId, membershipId, status, getUser(principal))));
    }

    @PostMapping("/admin/create")
    @Operation(summary = "Create and register a sports club")
    public ResponseEntity<ApiResponse<ClubDto>> createClub(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ClubCreateRequest request) {
        ClubDto created = clubService.createClub(request, getUser(principal));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created, "Club created successfully"));
    }
}

