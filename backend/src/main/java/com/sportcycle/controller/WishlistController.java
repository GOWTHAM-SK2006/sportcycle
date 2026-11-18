package com.sportcycle.controller;

import com.sportcycle.dto.ApiResponse;
import com.sportcycle.dto.WishlistDto;
import com.sportcycle.entity.User;
import com.sportcycle.repository.UserRepository;
import com.sportcycle.security.UserPrincipal;
import com.sportcycle.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "User favorite products and move to cart")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    @GetMapping
    @Operation(summary = "Get authenticated user wishlist")
    public ResponseEntity<ApiResponse<WishlistDto>> getWishlist(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(wishlistService.getWishlistDto(getUser(principal))));
    }

    @PostMapping("/products/{productId}")
    @Operation(summary = "Add product to wishlist")
    public ResponseEntity<ApiResponse<WishlistDto>> addToWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.ok(wishlistService.addToWishlist(productId, getUser(principal)), "Added to wishlist"));
    }

    @DeleteMapping("/products/{productId}")
    @Operation(summary = "Remove product from wishlist")
    public ResponseEntity<ApiResponse<WishlistDto>> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.ok(wishlistService.removeFromWishlist(productId, getUser(principal)), "Removed from wishlist"));
    }

    @PostMapping("/products/{productId}/move-to-cart")
    @Operation(summary = "Move product from wishlist to cart")
    public ResponseEntity<ApiResponse<Void>> moveToCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        wishlistService.moveToCart(productId, getUser(principal));
        return ResponseEntity.ok(ApiResponse.ok(null, "Moved to cart"));
    }
}

