package com.sportcycle.controller;

import com.sportcycle.dto.*;
import com.sportcycle.entity.User;
import com.sportcycle.repository.UserRepository;
import com.sportcycle.security.UserPrincipal;
import com.sportcycle.service.SellerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seller")
@RequiredArgsConstructor
@Tag(name = "Seller Portal", description = "Seller registration, inventory, dashboard stats, and listing controls")
public class SellerController {

    private final SellerService sellerService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    @PostMapping("/register")
    @Operation(summary = "Onboard user as a verified or individual seller")
    public ResponseEntity<ApiResponse<SellerDto>> registerSeller(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SellerRegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(sellerService.registerSeller(request, getUser(principal)), "Seller registered"));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER', 'ROLE_ADMIN')")
    @Operation(summary = "Get current seller profile")
    public ResponseEntity<ApiResponse<SellerDto>> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(sellerService.getSellerProfile(getUser(principal))));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER', 'ROLE_ADMIN')")
    @Operation(summary = "Get seller sales summary, active listings, and ratings")
    public ResponseEntity<ApiResponse<SellerStatsDto>> getStats(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(sellerService.getSellerStats(getUser(principal))));
    }

    @GetMapping("/products")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER', 'ROLE_ADMIN')")
    @Operation(summary = "List all products owned by authenticated seller")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getProducts(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(sellerService.getSellerProducts(getUser(principal))));
    }

    @PatchMapping("/products/{id}/toggle-status")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER', 'ROLE_ADMIN')")
    @Operation(summary = "Pause or activate seller product listing")
    public ResponseEntity<ApiResponse<ProductSummaryDto>> toggleProductStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(sellerService.toggleProductStatus(id, getUser(principal))));
    }
}

