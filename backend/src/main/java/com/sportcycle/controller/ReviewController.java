package com.sportcycle.controller;

import com.sportcycle.dto.ApiResponse;
import com.sportcycle.dto.PagedResponse;
import com.sportcycle.dto.ReviewCreateRequest;
import com.sportcycle.dto.ReviewDto;
import com.sportcycle.entity.User;
import com.sportcycle.repository.UserRepository;
import com.sportcycle.security.UserPrincipal;
import com.sportcycle.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Tag(name = "Customer Reviews", description = "Verified purchase product reviews and rating system")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get reviews for a product with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewDto>>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getProductReviews(productId, page, size)));
    }

    @PostMapping("/product/{productId}")
    @Operation(summary = "Post a verified customer review for a purchased product")
    public ResponseEntity<ApiResponse<ReviewDto>> addReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId,
            @Valid @RequestBody ReviewCreateRequest request) {
        ReviewDto review = reviewService.addReview(productId, request, getUser(principal));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(review, "Review submitted"));
    }
}

