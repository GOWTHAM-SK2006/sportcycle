package com.sportcycle.controller;

import com.sportcycle.dto.*;
import com.sportcycle.entity.User;
import com.sportcycle.entity.enums.ProductCondition;
import com.sportcycle.repository.UserRepository;
import com.sportcycle.security.UserPrincipal;
import com.sportcycle.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product discovery, search, filtering, and details")
public class ProductController {

    private final ProductService productService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Search and filter products with multi-sport, condition, and price filters")
    public ResponseEntity<ApiResponse<PagedResponse<ProductSummaryDto>>> getProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String sportSlug,
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) String brandSlug,
            @RequestParam(required = false) ProductCondition condition,
            @RequestParam(required = false) Boolean isPreOwned,
            @RequestParam(required = false) Boolean isVerified,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStockOnly,
            @RequestParam(defaultValue = "recommended") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        ProductFilterCriteria criteria = new ProductFilterCriteria();
        criteria.setQuery(query);
        criteria.setSportSlug(sportSlug);
        criteria.setCategorySlug(categorySlug);
        criteria.setBrandSlug(brandSlug);
        criteria.setCondition(condition);
        criteria.setIsPreOwned(isPreOwned);
        criteria.setIsVerified(isVerified);
        criteria.setMinPrice(minPrice);
        criteria.setMaxPrice(maxPrice);
        criteria.setInStockOnly(inStockOnly);
        criteria.setSortBy(sortBy);
        criteria.setPage(page);
        criteria.setSize(size);

        return ResponseEntity.ok(ApiResponse.ok(productService.searchAndFilterProducts(criteria)));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured products for homepage carousel")
    public ResponseEntity<ApiResponse<List<ProductSummaryDto>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getFeaturedProducts()));
    }

    @GetMapping("/pre-owned")
    @Operation(summary = "Get circular economy pre-owned sports gear")
    public ResponseEntity<ApiResponse<PagedResponse<ProductSummaryDto>>> getPreOwnedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getPreOwnedProducts(page, size)));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get full product details by unique slug")
    public ResponseEntity<ApiResponse<ProductDetailDto>> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProductBySlug(slug)));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER', 'ROLE_ADMIN', 'ROLE_CLUB_ADMIN')")
    @Operation(summary = "List a new sports product (authorized seller, club, or admin)")
    public ResponseEntity<ApiResponse<ProductDetailDto>> createProduct(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProductCreateRequest request) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        ProductDetailDto created = productService.createProduct(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(created, "Product listed successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER', 'ROLE_ADMIN')")
    @Operation(summary = "Delete product listing (owner or admin)")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        productService.deleteProduct(id, user);
        return ResponseEntity.ok(ApiResponse.ok(null, "Product deleted"));
    }
}

