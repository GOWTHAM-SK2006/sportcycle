package com.sportcycle.service;

import com.sportcycle.dto.PagedResponse;
import com.sportcycle.dto.ReviewCreateRequest;
import com.sportcycle.dto.ReviewDto;
import com.sportcycle.entity.Order;
import com.sportcycle.entity.Product;
import com.sportcycle.entity.Review;
import com.sportcycle.entity.User;
import com.sportcycle.entity.enums.OrderStatus;
import com.sportcycle.exception.BadRequestException;
import com.sportcycle.exception.ResourceNotFoundException;
import com.sportcycle.repository.OrderRepository;
import com.sportcycle.repository.ProductRepository;
import com.sportcycle.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public PagedResponse<ReviewDto> getProductReviews(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), size > 0 ? size : 10);
        Page<Review> reviewPage = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);

        return PagedResponse.<ReviewDto>builder()
                .content(reviewPage.getContent().stream().map(this::mapToDto).collect(Collectors.toList()))
                .page(reviewPage.getNumber())
                .size(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .last(reviewPage.isLast())
                .build();
    }

    @Transactional
    public ReviewDto addReview(Long productId, ReviewCreateRequest request, User user) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (reviewRepository.existsByProductIdAndUserId(productId, user.getId())) {
            throw new BadRequestException("You have already reviewed this product");
        }

        // Check if verified purchase: user has delivered order containing this product
        boolean isVerified = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .flatMap(o -> o.getItems().stream())
                .anyMatch(i -> i.getProduct().getId().equals(productId));

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .title(request.getTitle())
                .comment(request.getComment())
                .isVerifiedPurchase(isVerified)
                .build();

        Review saved = reviewRepository.save(review);

        // Recalculate product rating
        List<Review> allReviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        product.setRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
        product.setReviewCount(allReviews.size());
        productRepository.save(product);

        return mapToDto(saved);
    }

    private ReviewDto mapToDto(Review r) {
        return ReviewDto.builder()
                .id(r.getId())
                .productId(r.getProduct().getId())
                .productTitle(r.getProduct().getTitle())
                .userId(r.getUser().getId())
                .userName(r.getUser().getFullName())
                .userAvatar(r.getUser().getAvatarUrl())
                .rating(r.getRating())
                .title(r.getTitle())
                .comment(r.getComment())
                .isVerifiedPurchase(r.getIsVerifiedPurchase())
                .createdAt(r.getCreatedAt())
                .build();
    }
}

