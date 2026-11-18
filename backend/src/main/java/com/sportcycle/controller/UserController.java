package com.sportcycle.controller;

import com.sportcycle.dto.*;
import com.sportcycle.entity.User;
import com.sportcycle.repository.UserRepository;
import com.sportcycle.security.UserPrincipal;
import com.sportcycle.service.AuthService;
import com.sportcycle.service.UserAddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "User Profile & Addresses", description = "Manage user profile, passwords, and saved shipping addresses")
public class UserController {

    private final AuthService authService;
    private final UserAddressService addressService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(authService.getCurrentUserProfile(getUser(principal))));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update authenticated user profile information")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(authService.updateProfile(getUser(principal), request), "Profile updated"));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(getUser(principal), request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Password changed successfully"));
    }

    @GetMapping("/addresses")
    @Operation(summary = "List saved addresses for authenticated user")
    public ResponseEntity<ApiResponse<List<AddressDto>>> getAddresses(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(addressService.getUserAddresses(getUser(principal))));
    }

    @PostMapping("/addresses")
    @Operation(summary = "Save a new address")
    public ResponseEntity<ApiResponse<AddressDto>> addAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(addressService.addAddress(getUser(principal), request), "Address added"));
    }

    @PutMapping("/addresses/{id}")
    @Operation(summary = "Update an existing address")
    public ResponseEntity<ApiResponse<AddressDto>> updateAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(addressService.updateAddress(getUser(principal), id, request), "Address updated"));
    }

    @DeleteMapping("/addresses/{id}")
    @Operation(summary = "Delete an address")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        addressService.deleteAddress(getUser(principal), id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Address deleted"));
    }

    @PatchMapping("/addresses/{id}/default")
    @Operation(summary = "Set address as default")
    public ResponseEntity<ApiResponse<AddressDto>> setDefaultAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(addressService.setDefaultAddress(getUser(principal), id), "Default address updated"));
    }
}

