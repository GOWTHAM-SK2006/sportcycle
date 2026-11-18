package com.sportcycle.service;

import com.sportcycle.dto.*;
import com.sportcycle.entity.*;
import com.sportcycle.entity.enums.ProductCondition;
import com.sportcycle.entity.enums.ProductStatus;
import com.sportcycle.exception.BadRequestException;
import com.sportcycle.exception.ForbiddenException;
import com.sportcycle.exception.ResourceNotFoundException;
import com.sportcycle.repository.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final SportRepository sportRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final SellerRepository sellerRepository;
    private final ClubRepository clubRepository;
    private final AuditService auditService;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Transactional(readOnly = true)
    public PagedResponse<ProductSummaryDto> searchAndFilterProducts(ProductFilterCriteria criteria) {
        int page = Math.max(0, criteria.getPage());
        int size = criteria.getSize() > 0 ? criteria.getSize() : 12;

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("priceAsc".equalsIgnoreCase(criteria.getSortBy())) {
            sort = Sort.by(Sort.Direction.ASC, "sellingPrice");
        } else if ("priceDesc".equalsIgnoreCase(criteria.getSortBy())) {
            sort = Sort.by(Sort.Direction.DESC, "sellingPrice");
        } else if ("newest".equalsIgnoreCase(criteria.getSortBy())) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        } else if ("popularity".equalsIgnoreCase(criteria.getSortBy())) {
            sort = Sort.by(Sort.Direction.DESC, "reviewCount").and(Sort.by(Sort.Direction.DESC, "rating"));
        } else if ("recommended".equalsIgnoreCase(criteria.getSortBy())) {
            sort = Sort.by(Sort.Direction.DESC, "isFeatured").and(Sort.by(Sort.Direction.DESC, "rating"));
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only ACTIVE products visible in storefront search
            predicates.add(cb.equal(root.get("status"), ProductStatus.ACTIVE));

            if (criteria.getQuery() != null && !criteria.getQuery().trim().isEmpty()) {
                String searchTerm = "%" + criteria.getQuery().trim().toLowerCase() + "%";
                Predicate titleLike = cb.like(cb.lower(root.get("title")), searchTerm);
                Predicate descLike = cb.like(cb.lower(root.get("description")), searchTerm);

                Join<Product, Brand> brandJoin = root.join("brand", JoinType.LEFT);
                Predicate brandLike = cb.like(cb.lower(brandJoin.get("name")), searchTerm);

                Join<Product, Sport> sportJoin = root.join("sport", JoinType.LEFT);
                Predicate sportLike = cb.like(cb.lower(sportJoin.get("name")), searchTerm);

                predicates.add(cb.or(titleLike, descLike, brandLike, sportLike));
            }

            if (criteria.getSportSlug() != null && !criteria.getSportSlug().trim().isEmpty()) {
                Join<Product, Sport> sportJoin = root.join("sport", JoinType.INNER);
                predicates.add(cb.equal(sportJoin.get("slug"), criteria.getSportSlug().trim()));
            }

            if (criteria.getCategorySlug() != null && !criteria.getCategorySlug().trim().isEmpty()) {
                Join<Product, Category> catJoin = root.join("category", JoinType.INNER);
                predicates.add(cb.equal(catJoin.get("slug"), criteria.getCategorySlug().trim()));
            }

            if (criteria.getBrandSlug() != null && !criteria.getBrandSlug().trim().isEmpty()) {
                Join<Product, Brand> brandJoin = root.join("brand", JoinType.INNER);
                predicates.add(cb.equal(brandJoin.get("slug"), criteria.getBrandSlug().trim()));
            }

            if (criteria.getCondition() != null) {
                predicates.add(cb.equal(root.get("condition"), criteria.getCondition()));
            }

            if (criteria.getIsPreOwned() != null) {
                predicates.add(cb.equal(root.get("isPreOwned"), criteria.getIsPreOwned()));
            }

            if (criteria.getIsVerified() != null) {
                predicates.add(cb.equal(root.get("isVerified"), criteria.getIsVerified()));
            }

            if (criteria.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("sellingPrice"), criteria.getMinPrice()));
            }

            if (criteria.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("sellingPrice"), criteria.getMaxPrice()));
            }

            if (Boolean.TRUE.equals(criteria.getInStockOnly())) {
                predicates.add(cb.greaterThan(root.get("stockQuantity"), 0));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> productPage = productRepository.findAll(spec, pageable);

        List<ProductSummaryDto> dtos = productPage.getContent().stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());

        return PagedResponse.<ProductSummaryDto>builder()
                .content(dtos)
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public ProductDetailDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));

        return mapToDetailDto(product);
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryDto> getFeaturedProducts() {
        return productRepository.findByStatusAndIsFeaturedTrue(ProductStatus.ACTIVE, PageRequest.of(0, 8))
                .getContent()
                .stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductSummaryDto> getPreOwnedProducts(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), size > 0 ? size : 12, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> preOwnedPage = productRepository.findByStatusAndIsPreOwnedTrue(ProductStatus.ACTIVE, pageable);

        return PagedResponse.<ProductSummaryDto>builder()
                .content(preOwnedPage.getContent().stream().map(this::mapToSummaryDto).collect(Collectors.toList()))
                .page(preOwnedPage.getNumber())
                .size(preOwnedPage.getSize())
                .totalElements(preOwnedPage.getTotalElements())
                .totalPages(preOwnedPage.getTotalPages())
                .last(preOwnedPage.isLast())
                .build();
    }

    @Transactional
    public ProductDetailDto createProduct(ProductCreateRequest request, User currentUser) {
        Sport sport = sportRepository.findById(request.getSportId())
                .orElseThrow(() -> new ResourceNotFoundException("Sport not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Brand brand = null;
        if (request.getBrandId() != null) {
            brand = brandRepository.findById(request.getBrandId()).orElse(null);
        }

        Seller seller = sellerRepository.findByUserId(currentUser.getId()).orElse(null);
        Club club = null;
        if (request.getClubId() != null) {
            club = clubRepository.findById(request.getClubId()).orElse(null);
        }

        String baseSlug = toSlug(request.getTitle());
        String slug = baseSlug + "-" + UUID.randomUUID().toString().substring(0, 6);

        int discount = 0;
        if (request.getOriginalPrice() != null && request.getOriginalPrice().compareTo(BigDecimal.ZERO) > 0
                && request.getSellingPrice() != null && request.getSellingPrice().compareTo(request.getOriginalPrice()) < 0) {
            BigDecimal diff = request.getOriginalPrice().subtract(request.getSellingPrice());
            discount = diff.divide(request.getOriginalPrice(), 2, RoundingMode.HALF_UP).multiply(new BigDecimal(100)).intValue();
        }

        boolean isPreOwned = Boolean.TRUE.equals(request.getIsPreOwned()) || request.getCondition() != ProductCondition.BRAND_NEW;

        Product product = Product.builder()
                .seller(seller)
                .club(club)
                .sport(sport)
                .category(category)
                .brand(brand)
                .title(request.getTitle())
                .slug(slug)
                .description(request.getDescription())
                .condition(request.getCondition() != null ? request.getCondition() : ProductCondition.BRAND_NEW)
                .isPreOwned(isPreOwned)
                .usageDurationMonths(request.getUsageDurationMonths() != null ? request.getUsageDurationMonths() : 0)
                .wearDetails(request.getWearDetails())
                .isVerified(false) // Never auto-verified; admin or verification flow controls this
                .originalPrice(request.getOriginalPrice())
                .sellingPrice(request.getSellingPrice())
                .discountPercentage(discount)
                .stockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 1)
                .sku(request.getSku() != null ? request.getSku() : "SKU-" + System.currentTimeMillis())
                .sizes(request.getSizes())
                .status(ProductStatus.ACTIVE)
                .isFeatured(false)
                .rating(BigDecimal.ZERO)
                .reviewCount(0)
                .location(request.getLocation() != null ? request.getLocation() : "India")
                .build();

        Product saved = productRepository.save(product);

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                images.add(ProductImage.builder()
                        .product(saved)
                        .imageUrl(request.getImageUrls().get(i))
                        .altText(saved.getTitle())
                        .displayOrder(i)
                        .isPrimary(i == 0)
                        .build());
            }
            productImageRepository.saveAll(images);
            saved.setImages(images);
        }

        auditService.log(currentUser.getEmail(), "CREATE_PRODUCT", "Product", saved.getId().toString(), null, "Created product: " + saved.getTitle());

        return mapToDetailDto(saved);
    }

    @Transactional
    public void deleteProduct(Long id, User currentUser) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        boolean isAdmin = currentUser.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName()));
        boolean isOwner = product.getSeller() != null && product.getSeller().getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new ForbiddenException("You cannot delete this product");
        }

        productRepository.delete(product);
        auditService.log(currentUser.getEmail(), "DELETE_PRODUCT", "Product", id.toString(), null, "Deleted product: " + product.getTitle());
    }

    public ProductSummaryDto mapToSummaryDto(Product p) {
        String primaryImg = null;
        if (p.getImages() != null && !p.getImages().isEmpty()) {
            primaryImg = p.getImages().stream()
                    .filter(ProductImage::getIsPrimary)
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(p.getImages().get(0).getImageUrl());
        }

        return ProductSummaryDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .slug(p.getSlug())
                .brandName(p.getBrand() != null ? p.getBrand().getName() : "Generic")
                .sportName(p.getSport().getName())
                .sportSlug(p.getSport().getSlug())
                .categoryName(p.getCategory().getName())
                .categorySlug(p.getCategory().getSlug())
                .condition(p.getCondition())
                .isPreOwned(p.getIsPreOwned())
                .isVerified(p.getIsVerified())
                .originalPrice(p.getOriginalPrice())
                .sellingPrice(p.getSellingPrice())
                .discountPercentage(p.getDiscountPercentage())
                .stockQuantity(p.getStockQuantity())
                .status(p.getStatus())
                .isFeatured(p.getIsFeatured())
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .primaryImageUrl(primaryImg)
                .location(p.getLocation())
                .sizes(p.getSizes())
                .build();
    }

    public ProductDetailDto mapToDetailDto(Product p) {
        List<String> imageUrls = p.getImages() != null ?
                p.getImages().stream().map(ProductImage::getImageUrl).collect(Collectors.toList()) :
                List.of();

        SellerSummaryDto sellerDto = null;
        if (p.getSeller() != null) {
            sellerDto = SellerSummaryDto.builder()
                    .id(p.getSeller().getId())
                    .businessName(p.getSeller().getBusinessName())
                    .sellerType(p.getSeller().getSellerType())
                    .isVerified(p.getSeller().getIsVerified())
                    .rating(p.getSeller().getRating())
                    .totalSales(p.getSeller().getTotalSales())
                    .phone(p.getSeller().getPhone())
                    .bio(p.getSeller().getBio())
                    .build();
        }

        ClubSummaryDto clubDto = null;
        if (p.getClub() != null) {
            clubDto = ClubSummaryDto.builder()
                    .id(p.getClub().getId())
                    .name(p.getClub().getName())
                    .slug(p.getClub().getSlug())
                    .location(p.getClub().getLocation())
                    .city(p.getClub().getCity())
                    .state(p.getClub().getState())
                    .logoUrl(p.getClub().getLogoUrl())
                    .isVerified(p.getClub().getIsVerified())
                    .membershipOpen(p.getClub().getMembershipOpen())
                    .build();
        }

        return ProductDetailDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .slug(p.getSlug())
                .description(p.getDescription())
                .sportId(p.getSport().getId())
                .sportName(p.getSport().getName())
                .sportSlug(p.getSport().getSlug())
                .categoryId(p.getCategory().getId())
                .categoryName(p.getCategory().getName())
                .categorySlug(p.getCategory().getSlug())
                .brandId(p.getBrand() != null ? p.getBrand().getId() : null)
                .brandName(p.getBrand() != null ? p.getBrand().getName() : null)
                .brandLogoUrl(p.getBrand() != null ? p.getBrand().getLogoUrl() : null)
                .condition(p.getCondition())
                .isPreOwned(p.getIsPreOwned())
                .usageDurationMonths(p.getUsageDurationMonths())
                .wearDetails(p.getWearDetails())
                .isVerified(p.getIsVerified())
                .originalPrice(p.getOriginalPrice())
                .sellingPrice(p.getSellingPrice())
                .discountPercentage(p.getDiscountPercentage())
                .stockQuantity(p.getStockQuantity())
                .sku(p.getSku())
                .sizes(p.getSizes())
                .status(p.getStatus())
                .isFeatured(p.getIsFeatured())
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .location(p.getLocation())
                .imageUrls(imageUrls)
                .seller(sellerDto)
                .club(clubDto)
                .createdAt(p.getCreatedAt())
                .build();
    }

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}

