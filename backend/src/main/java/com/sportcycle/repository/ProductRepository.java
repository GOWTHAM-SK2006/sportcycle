package com.sportcycle.repository;

import com.sportcycle.entity.Product;
import com.sportcycle.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    Page<Product> findByStatusAndIsFeaturedTrue(ProductStatus status, Pageable pageable);

    Page<Product> findByStatusAndIsPreOwnedTrue(ProductStatus status, Pageable pageable);

    List<Product> findBySellerId(Long sellerId);

    List<Product> findByClubId(Long clubId);

    long countByStatus(ProductStatus status);

    long countByIsPreOwnedTrue();
}

