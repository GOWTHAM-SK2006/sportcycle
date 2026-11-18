package com.sportcycle.repository;

import com.sportcycle.entity.ClubMembership;
import com.sportcycle.entity.enums.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubMembershipRepository extends JpaRepository<ClubMembership, Long> {
    List<ClubMembership> findByClubId(Long clubId);
    List<ClubMembership> findByUserId(Long userId);
    Optional<ClubMembership> findByClubIdAndUserId(Long clubId, Long userId);
    List<ClubMembership> findByClubIdAndStatus(Long clubId, MembershipStatus status);
}

