package com.sportcycle.service;

import com.sportcycle.dto.*;
import com.sportcycle.entity.*;
import com.sportcycle.entity.enums.OrderStatus;
import com.sportcycle.entity.enums.PaymentStatus;
import com.sportcycle.entity.enums.ProductStatus;
import com.sportcycle.exception.ResourceNotFoundException;
import com.sportcycle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final ClubRepository clubRepository;
    private final AuditLogRepository auditLogRepository;
    private final OrderService orderService;
    private final ProductService productService;
    private final AuthService authService;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public AdminStatsDto getAdminStats() {
        List<Order> orders = orderRepository.findAll();
        BigDecimal totalRevenue = orders.stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.PAID)
                .map(Order::getFinalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalOrders = orders.size();
        long totalCustomers = userRepository.count();
        long totalSellers = sellerRepository.count();
        long totalProducts = productRepository.count();
        long activeListings = productRepository.countByStatus(ProductStatus.ACTIVE);
        long pendingApprovals = productRepository.countByStatus(ProductStatus.PENDING_APPROVAL);
        long totalClubs = clubRepository.count();
        long preOwnedProducts = productRepository.countByIsPreOwnedTrue();

        return AdminStatsDto.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .totalCustomers(totalCustomers)
                .totalSellers(totalSellers)
                .totalProducts(totalProducts)
                .activeListings(activeListings)
                .pendingApprovals(pendingApprovals)
                .totalClubs(totalClubs)
                .preOwnedProducts(preOwnedProducts)
                .build();
    }

    @Transactional
    public ProductDetailDto moderateProduct(Long productId, ProductModerationRequest request, String adminEmail) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setStatus(request.getStatus());
        if (request.getIsVerified() != null) {
            product.setIsVerified(request.getIsVerified());
        }

        Product updated = productRepository.save(product);
        auditService.log(adminEmail, "MODERATE_PRODUCT", "Product", productId.toString(), null,
                "Status: " + request.getStatus() + ", Verified: " + request.getIsVerified() + ", Reason: " + request.getReason());

        return productService.mapToDetailDto(updated);
    }

    @Transactional
    public ProductDetailDto toggleFeaturedProduct(Long productId, String adminEmail) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setIsFeatured(!Boolean.TRUE.equals(product.getIsFeatured()));
        Product updated = productRepository.save(product);

        auditService.log(adminEmail, "TOGGLE_FEATURED", "Product", productId.toString(), null,
                "Featured status changed to " + product.getIsFeatured());

        return productService.mapToDetailDto(updated);
    }

    @Transactional(readOnly = true)
    public PagedResponse<OrderResponseDto> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), size > 0 ? size : 15, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orderPage = orderRepository.findAll(pageable);

        return PagedResponse.<OrderResponseDto>builder()
                .content(orderPage.getContent().stream().map(orderService::mapToOrderDto).collect(Collectors.toList()))
                .page(orderPage.getNumber())
                .size(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserProfileDto> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), size > 0 ? size : 15, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> userPage = userRepository.findAll(pageable);

        return PagedResponse.<UserProfileDto>builder()
                .content(userPage.getContent().stream().map(authService::mapToProfileDto).collect(Collectors.toList()))
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .build();
    }

    @Transactional
    public UserProfileDto toggleUserStatus(Long userId, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        User updated = userRepository.save(user);

        auditService.log(adminEmail, "TOGGLE_USER_STATUS", "User", userId.toString(), null,
                "Active status set to " + updated.getIsActive());

        return authService.mapToProfileDto(updated);
    }

    @Transactional(readOnly = true)
    public PagedResponse<AuditLog> getAuditLogs(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), size > 0 ? size : 20, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AuditLog> logPage = auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);

        return PagedResponse.<AuditLog>builder()
                .content(logPage.getContent())
                .page(logPage.getNumber())
                .size(logPage.getSize())
                .totalElements(logPage.getTotalElements())
                .totalPages(logPage.getTotalPages())
                .last(logPage.isLast())
                .build();
    }
}

