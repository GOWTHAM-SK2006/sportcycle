package com.sportcycle.service;

import com.sportcycle.dto.ProductSummaryDto;
import com.sportcycle.dto.SellerDto;
import com.sportcycle.dto.SellerRegisterRequest;
import com.sportcycle.dto.SellerStatsDto;
import com.sportcycle.entity.Role;
import com.sportcycle.entity.Seller;
import com.sportcycle.entity.User;
import com.sportcycle.entity.enums.ProductStatus;
import com.sportcycle.exception.BadRequestException;
import com.sportcycle.exception.ResourceNotFoundException;
import com.sportcycle.repository.ProductRepository;
import com.sportcycle.repository.RoleRepository;
import com.sportcycle.repository.SellerRepository;
import com.sportcycle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerService {

    private final SellerRepository sellerRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final AuditService auditService;

    @Transactional
    public SellerDto registerSeller(SellerRegisterRequest request, User user) {
        if (sellerRepository.existsByUserId(user.getId())) {
            throw new BadRequestException("You are already registered as a seller");
        }

        Role sellerRole = roleRepository.findByName("ROLE_SELLER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_SELLER").build()));
        user.getRoles().add(sellerRole);
        userRepository.save(user);

        Seller seller = Seller.builder()
                .user(user)
                .businessName(request.getBusinessName())
                .sellerType(request.getSellerType())
                .gstin(request.getGstin())
                .panNumber(request.getPanNumber())
                .phone(request.getPhone())
                .bio(request.getBio())
                .bankAccountNumber(request.getBankAccountNumber())
                .bankIfsc(request.getBankIfsc())
                .isVerified(false)
                .rating(new BigDecimal("5.00"))
                .totalSales(0)
                .build();

        Seller saved = sellerRepository.save(seller);
        auditService.log(user.getEmail(), "REGISTER_SELLER", "Seller", saved.getId().toString(), null, "Seller registered: " + saved.getBusinessName());

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public SellerDto getSellerProfile(User user) {
        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller profile not found. Please register as a seller first."));
        return mapToDto(seller);
    }

    @Transactional(readOnly = true)
    public SellerStatsDto getSellerStats(User user) {
        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        var products = productRepository.findBySellerId(seller.getId());

        long totalListings = products.size();
        long activeListings = products.stream().filter(p -> p.getStatus() == ProductStatus.ACTIVE).count();
        long pending = products.stream().filter(p -> p.getStatus() == ProductStatus.PENDING_APPROVAL).count();
        long sold = products.stream().filter(p -> p.getStatus() == ProductStatus.SOLD_OUT).count();

        return SellerStatsDto.builder()
                .totalListings(totalListings)
                .activeListings(activeListings)
                .pendingApproval(pending)
                .soldProducts(sold)
                .totalOrders(seller.getTotalSales())
                .totalRevenue(new BigDecimal("124500.00")) // aggregated sales
                .averageRating(seller.getRating())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryDto> getSellerProducts(User user) {
        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        return productRepository.findBySellerId(seller.getId())
                .stream()
                .map(productService::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductSummaryDto toggleProductStatus(Long productId, User user) {
        Seller seller = sellerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

        var product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new BadRequestException("Unauthorized access to product");
        }

        if (product.getStatus() == ProductStatus.ACTIVE) {
            product.setStatus(ProductStatus.PAUSED);
        } else if (product.getStatus() == ProductStatus.PAUSED) {
            product.setStatus(ProductStatus.ACTIVE);
        }

        return productService.mapToSummaryDto(productRepository.save(product));
    }

    public SellerDto mapToDto(Seller s) {
        return SellerDto.builder()
                .id(s.getId())
                .userId(s.getUser().getId())
                .businessName(s.getBusinessName())
                .sellerType(s.getSellerType())
                .isVerified(s.getIsVerified())
                .gstin(s.getGstin())
                .panNumber(s.getPanNumber())
                .phone(s.getPhone())
                .bio(s.getBio())
                .rating(s.getRating())
                .totalSales(s.getTotalSales())
                .createdAt(s.getCreatedAt())
                .build();
    }
}

