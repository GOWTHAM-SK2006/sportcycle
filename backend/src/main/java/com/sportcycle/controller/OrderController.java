package com.sportcycle.controller;

import com.sportcycle.dto.ApiResponse;
import com.sportcycle.dto.CheckoutRequest;
import com.sportcycle.dto.OrderResponseDto;
import com.sportcycle.dto.PagedResponse;
import com.sportcycle.entity.User;
import com.sportcycle.repository.UserRepository;
import com.sportcycle.security.UserPrincipal;
import com.sportcycle.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order placement, history, tracking timeline, and cancellation")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    @PostMapping("/checkout")
    @Operation(summary = "Place order from current shopping cart")
    public ResponseEntity<ApiResponse<OrderResponseDto>> checkout(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CheckoutRequest request) {
        OrderResponseDto order = orderService.createOrderFromCart(request, getUser(principal));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(order, "Order created successfully"));
    }

    @GetMapping
    @Operation(summary = "Get user order history with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponseDto>>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getUserOrders(getUser(principal), page, size)));
    }

    @GetMapping("/{orderNumber}")
    @Operation(summary = "Get order details and tracking timeline by order number")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderByNumber(orderNumber, getUser(principal))));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order before shipping")
    public ResponseEntity<ApiResponse<OrderResponseDto>> cancelOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestParam(defaultValue = "Customer requested cancellation") String reason) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.cancelOrder(id, reason, getUser(principal)), "Order cancelled"));
    }
}

