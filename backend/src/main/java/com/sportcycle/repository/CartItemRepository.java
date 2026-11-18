package com.sportcycle.repository;

import com.sportcycle.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartId(Long cartId);
    Optional<CartItem> findByCartIdAndProductIdAndSelectedSize(Long cartId, Long productId, String selectedSize);
    void deleteByCartId(Long cartId);
}

