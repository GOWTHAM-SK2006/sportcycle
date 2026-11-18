package com.sportcycle.repository;

import com.sportcycle.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    Optional<Club> findBySlug(String slug);
    List<Club> findByAdminUserId(Long adminUserId);
    List<Club> findBySportId(Long sportId);
}

