package com.sportcycle.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Builder.Default
    @Column(nullable = false, length = 50)
    private String paymentGateway = "RAZORPAY";

    @Column(length = 120)
    private String transactionId;

    @Column(length = 120)
    private String gatewayOrderId;

    @Column(length = 120)
    private String gatewayPaymentId;

    @Column(length = 255)
    private String gatewaySignature;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Builder.Default
    @Column(length = 10)
    private String currency = "INR";

    @Builder.Default
    @Column(nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, SUCCESS, FAILED, REFUNDED

    @Column(columnDefinition = "TEXT")
    private String rawResponse;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}

