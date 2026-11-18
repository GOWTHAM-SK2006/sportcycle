package com.sportcycle.entity;

import com.sportcycle.entity.enums.MembershipStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "club_memberships", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"club_id", "user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private MembershipStatus status = MembershipStatus.PENDING;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant requestedAt;

    private Instant reviewedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;
}

