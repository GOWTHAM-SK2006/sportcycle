package com.sportcycle.entity;

import com.sportcycle.entity.enums.SellerType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "sellers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 180)
    private String businessName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private SellerType sellerType = SellerType.INDIVIDUAL;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isVerified = false;

    @Column(length = 50)
    private String gstin;

    @Column(length = 50)
    private String panNumber;

    @Column(length = 30)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 50)
    private String bankAccountNumber;

    @Column(length = 30)
    private String bankIfsc;

    @Builder.Default
    @Column(precision = 3, scale = 2)
    private BigDecimal rating = new BigDecimal("5.00");

    @Builder.Default
    private Integer totalSales = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}

