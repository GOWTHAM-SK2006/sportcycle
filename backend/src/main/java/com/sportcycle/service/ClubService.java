package com.sportcycle.service;

import com.sportcycle.dto.*;
import com.sportcycle.entity.*;
import com.sportcycle.entity.enums.MembershipStatus;
import com.sportcycle.entity.enums.NotificationType;
import com.sportcycle.exception.BadRequestException;
import com.sportcycle.exception.ForbiddenException;
import com.sportcycle.exception.ResourceNotFoundException;
import com.sportcycle.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;
    private final ClubMembershipRepository membershipRepository;
    private final SportRepository sportRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final NotificationService notificationService;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<ClubDto> getAllClubs() {
        return clubRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClubDto getClubBySlug(String slug) {
        Club club = clubRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with slug: " + slug));
        return mapToDto(club);
    }

    @Transactional(readOnly = true)
    public List<ProductSummaryDto> getClubProducts(String slug) {
        Club club = clubRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with slug: " + slug));

        return productRepository.findByClubId(club.getId()).stream()
                .map(productService::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClubMembershipDto requestMembership(Long clubId, String notes, User user) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found"));

        if (!club.getMembershipOpen()) {
            throw new BadRequestException("Club memberships are currently closed");
        }

        if (membershipRepository.findByClubIdAndUserId(clubId, user.getId()).isPresent()) {
            throw new BadRequestException("You have already requested or active membership in this club");
        }

        ClubMembership membership = ClubMembership.builder()
                .club(club)
                .user(user)
                .status(MembershipStatus.PENDING)
                .notes(notes)
                .build();

        ClubMembership saved = membershipRepository.save(membership);

        notificationService.createNotification(
                club.getAdminUser(),
                "New Club Membership Request",
                user.getFullName() + " has requested to join " + club.getName(),
                NotificationType.CLUB,
                "/clubs/admin/memberships"
        );

        return mapMembershipToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ClubMembershipDto> getClubMemberships(Long clubId, User user) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found"));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName()));
        if (!club.getAdminUser().getId().equals(user.getId()) && !isAdmin) {
            throw new ForbiddenException("You are not the administrator of this club");
        }

        return membershipRepository.findByClubId(clubId).stream()
                .map(this::mapMembershipToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClubMembershipDto reviewMembership(Long clubId, Long membershipId, MembershipStatus newStatus, User user) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found"));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName()));
        if (!club.getAdminUser().getId().equals(user.getId()) && !isAdmin) {
            throw new ForbiddenException("You are not the administrator of this club");
        }

        ClubMembership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership request not found"));

        membership.setStatus(newStatus);
        membership.setReviewedAt(Instant.now());
        ClubMembership updated = membershipRepository.save(membership);

        if (newStatus == MembershipStatus.APPROVED) {
            club.setMemberCount(club.getMemberCount() + 1);
            clubRepository.save(club);
        }

        notificationService.createNotification(
                membership.getUser(),
                "Club Membership " + newStatus,
                "Your membership request for " + club.getName() + " has been " + newStatus,
                NotificationType.CLUB,
                "/clubs/" + club.getSlug()
        );

        return mapMembershipToDto(updated);
    }

    @Transactional
    public ClubDto createClub(ClubCreateRequest request, User user) {
        Sport sport = null;
        if (request.getSportId() != null) {
            sport = sportRepository.findById(request.getSportId()).orElse(null);
        }

        String slug = request.getName().toLowerCase().replaceAll("[^a-z0-9]", "-") + "-" + UUID.randomUUID().toString().substring(0, 5);

        Role clubAdminRole = roleRepository.findByName("ROLE_CLUB_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_CLUB_ADMIN").build()));
        user.getRoles().add(clubAdminRole);
        userRepository.save(user);

        Club club = Club.builder()
                .adminUser(user)
                .name(request.getName())
                .slug(slug)
                .sport(sport)
                .location(request.getLocation())
                .city(request.getCity())
                .state(request.getState())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl() != null ? request.getLogoUrl() : "https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=300")
                .bannerUrl(request.getBannerUrl() != null ? request.getBannerUrl() : "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200")
                .contactEmail(request.getContactEmail() != null ? request.getContactEmail() : user.getEmail())
                .contactPhone(request.getContactPhone() != null ? request.getContactPhone() : user.getPhone())
                .membershipOpen(Boolean.TRUE.equals(request.getMembershipOpen()))
                .memberCount(1)
                .isVerified(false)
                .build();

        Club saved = clubRepository.save(club);
        auditService.log(user.getEmail(), "CREATE_CLUB", "Club", saved.getId().toString(), null, "Created club: " + saved.getName());

        return mapToDto(saved);
    }

    public ClubDto mapToDto(Club c) {
        return ClubDto.builder()
                .id(c.getId())
                .adminUserId(c.getAdminUser().getId())
                .name(c.getName())
                .slug(c.getSlug())
                .sportId(c.getSport() != null ? c.getSport().getId() : null)
                .sportName(c.getSport() != null ? c.getSport().getName() : null)
                .location(c.getLocation())
                .city(c.getCity())
                .state(c.getState())
                .description(c.getDescription())
                .logoUrl(c.getLogoUrl())
                .bannerUrl(c.getBannerUrl())
                .contactEmail(c.getContactEmail())
                .contactPhone(c.getContactPhone())
                .membershipOpen(c.getMembershipOpen())
                .memberCount(c.getMemberCount())
                .isVerified(c.getIsVerified())
                .createdAt(c.getCreatedAt())
                .build();
    }

    private ClubMembershipDto mapMembershipToDto(ClubMembership m) {
        return ClubMembershipDto.builder()
                .id(m.getId())
                .clubId(m.getClub().getId())
                .clubName(m.getClub().getName())
                .userId(m.getUser().getId())
                .userName(m.getUser().getFullName())
                .userEmail(m.getUser().getEmail())
                .status(m.getStatus())
                .requestedAt(m.getRequestedAt())
                .reviewedAt(m.getReviewedAt())
                .notes(m.getNotes())
                .build();
    }
}

