package com.sportcycle.entity;

import com.sportcycle.entity.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private NotificationType type = NotificationType.SYSTEM;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isRead = false;

    @Column(columnDefinition = "TEXT")
    private String linkUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}

