package com.sportcycle.controller;

import com.sportcycle.dto.*;
import com.sportcycle.entity.AuditLog;
import com.sportcycle.security.UserPrincipal;
import com.sportcycle.service.AdminService;
import com.sportcycle.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Operations", description = "Marketplace administration, verification, analytics, and moderation")
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;

    @GetMapping("/stats")
    @Operation(summary = "Get marketplace revenue, user counts, and listing statistics")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAdminStats()));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get all marketplace orders with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponseDto>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllOrders(page, size)));
    }

    @PatchMapping("/orders/{id}/status")
    @Operation(summary = "Update order status and tracking details as an admin")
    public ResponseEntity<ApiResponse<OrderResponseDto>> updateOrderStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.updateOrderStatus(id, request, principal.getUsername()), "Order status updated"));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users registered in the system")
    public ResponseEntity<ApiResponse<PagedResponse<UserProfileDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllUsers(page, size)));
    }

    @PatchMapping("/users/{id}/toggle-status")
    @Operation(summary = "Suspend or reactivate a user account")
    public ResponseEntity<ApiResponse<UserProfileDto>> toggleUserStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.toggleUserStatus(id, principal.getUsername()), "User status updated"));
    }

    @PatchMapping("/products/{id}/moderate")
    @Operation(summary = "Moderate product (approve, reject, or assign verified badge)")
    public ResponseEntity<ApiResponse<ProductDetailDto>> moderateProduct(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody ProductModerationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.moderateProduct(id, request, principal.getUsername()), "Product moderated"));
    }

    @PatchMapping("/products/{id}/toggle-featured")
    @Operation(summary = "Toggle product featured badge on homepage carousel")
    public ResponseEntity<ApiResponse<ProductDetailDto>> toggleFeatured(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.toggleFeaturedProduct(id, principal.getUsername())));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Inspect tamper-evident administrative audit logs")
    public ResponseEntity<ApiResponse<PagedResponse<AuditLog>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAuditLogs(page, size)));
    }
}

