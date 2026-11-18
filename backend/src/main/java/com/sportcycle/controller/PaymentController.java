package com.sportcycle.controller;

import com.sportcycle.dto.ApiResponse;
import com.sportcycle.dto.PaymentOrderDto;
import com.sportcycle.dto.PaymentVerificationRequest;
import com.sportcycle.entity.User;
import com.sportcycle.repository.UserRepository;
import com.sportcycle.security.UserPrincipal;
import com.sportcycle.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Razorpay order creation and signature verification")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    @PostMapping("/create-order")
    @Operation(summary = "Initialize payment gateway order for an existing order")
    public ResponseEntity<ApiResponse<PaymentOrderDto>> createPaymentOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String orderNumber) {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.createPaymentOrder(orderNumber, getUser(principal))));
    }

    @PostMapping("/verify")
    @Operation(summary = "Cryptographically verify Razorpay payment signature and mark order paid")
    public ResponseEntity<ApiResponse<Boolean>> verifyPayment(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PaymentVerificationRequest request) {
        boolean verified = paymentService.verifyPayment(request, getUser(principal));
        return ResponseEntity.ok(ApiResponse.ok(verified, "Payment verified successfully"));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Razorpay webhook listener")
    public ResponseEntity<ApiResponse<String>> webhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        // Log & acknowledge webhook safely
        return ResponseEntity.ok(ApiResponse.ok("Webhook received"));
    }
}

