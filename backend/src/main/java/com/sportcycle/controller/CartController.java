package com.sportcycle.controller;

import com.sportcycle.dto.AddToCartRequest;
import com.sportcycle.dto.ApiResponse;
import com.sportcycle.dto.CartDto;
import com.sportcycle.dto.UpdateCartItemRequest;
import com.sportcycle.entity.User;
import com.sportcycle.repository.UserRepository;
import com.sportcycle.security.UserPrincipal;
import com.sportcycle.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Shopping Cart", description = "Cart persistence, items, live inventory validation, and pricing recalculation")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    private User getUserOrNull(UserPrincipal principal) {
        if (principal == null) return null;
        return userRepository.findById(principal.getId()).orElse(null);
    }

    @GetMapping
    @Operation(summary = "Get user or guest cart")
    public ResponseEntity<ApiResponse<CartDto>> getCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.getCartDto(getUserOrNull(principal), sessionId)));
    }

    @PostMapping("/items")
    @Operation(summary = "Add product to cart")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId,
            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.addToCart(request, getUserOrNull(principal), sessionId), "Item added to cart"));
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update quantity or size of a cart item")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.updateCartItem(itemId, request, getUserOrNull(principal), sessionId), "Cart updated"));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<ApiResponse<CartDto>> removeCartItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.removeCartItem(itemId, getUserOrNull(principal), sessionId), "Item removed"));
    }

    @DeleteMapping
    @Operation(summary = "Clear all items in cart")
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestHeader(value = "X-Session-ID", required = false) String sessionId) {
        cartService.clearCart(getUserOrNull(principal), sessionId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Cart cleared"));
    }

    @PostMapping("/merge")
    @Operation(summary = "Merge guest cart into authenticated user cart upon login")
    public ResponseEntity<ApiResponse<CartDto>> mergeCart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String guestSessionId) {
        User user = getUserOrNull(principal);
        return ResponseEntity.ok(ApiResponse.ok(cartService.mergeGuestCart(user, guestSessionId), "Cart merged"));
    }
}

