package com.sportcycle.entity;

import com.sportcycle.entity.enums.ProductCondition;
import com.sportcycle.entity.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private Seller seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    private Club club;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_id", nullable = false)
    private Sport sport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, unique = true, length = 280)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_condition", nullable = false, length = 30)
    @Builder.Default
    private ProductCondition condition = ProductCondition.BRAND_NEW;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isPreOwned = false;

    @Builder.Default
    private Integer usageDurationMonths = 0;

    @Column(columnDefinition = "TEXT")
    private String wearDetails;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isVerified = false;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal sellingPrice;

    @Builder.Default
    private Integer discountPercentage = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer stockQuantity = 1;

    @Column(unique = true, length = 100)
    private String sku;

    @Column(length = 200)
    private String sizes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ProductStatus status = ProductStatus.ACTIVE;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isFeatured = false;

    @Builder.Default
    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;

    @Builder.Default
    private Integer reviewCount = 0;

    @Column(length = 150)
    private String location;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}

