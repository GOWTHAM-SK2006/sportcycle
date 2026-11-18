package com.sportcycle.service;

import com.sportcycle.dto.AddToCartRequest;
import com.sportcycle.dto.WishlistDto;
import com.sportcycle.dto.WishlistItemDto;
import com.sportcycle.entity.Product;
import com.sportcycle.entity.User;
import com.sportcycle.entity.Wishlist;
import com.sportcycle.entity.WishlistItem;
import com.sportcycle.exception.ResourceNotFoundException;
import com.sportcycle.repository.ProductRepository;
import com.sportcycle.repository.WishlistItemRepository;
import com.sportcycle.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final CartService cartService;

    @Transactional
    public Wishlist getOrCreateWishlist(User user) {
        return wishlistRepository.findByUserId(user.getId())
                .orElseGet(() -> wishlistRepository.save(Wishlist.builder().user(user).build()));
    }

    @Transactional(readOnly = true)
    public WishlistDto getWishlistDto(User user) {
        Wishlist wishlist = wishlistRepository.findByUserId(user.getId()).orElse(null);
        if (wishlist == null) {
            return WishlistDto.builder().id(null).items(List.of()).totalItems(0).build();
        }

        List<WishlistItemDto> itemDtos = wishlistItemRepository.findByWishlistIdOrderByCreatedAtDesc(wishlist.getId())
                .stream()
                .map(item -> WishlistItemDto.builder()
                        .id(item.getId())
                        .product(productService.mapToSummaryDto(item.getProduct()))
                        .addedAt(item.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return WishlistDto.builder()
                .id(wishlist.getId())
                .items(itemDtos)
                .totalItems(itemDtos.size())
                .build();
    }

    @Transactional
    public WishlistDto addToWishlist(Long productId, User user) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Wishlist wishlist = getOrCreateWishlist(user);

        if (!wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId)) {
            WishlistItem item = WishlistItem.builder()
                    .wishlist(wishlist)
                    .product(product)
                    .build();
            wishlistItemRepository.save(item);
        }

        return getWishlistDto(user);
    }

    @Transactional
    public WishlistDto removeFromWishlist(Long productId, User user) {
        Wishlist wishlist = getOrCreateWishlist(user);
        wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId)
                .ifPresent(wishlistItemRepository::delete);

        return getWishlistDto(user);
    }

    @Transactional
    public void moveToCart(Long productId, User user) {
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(productId);
        request.setQuantity(1);

        cartService.addToCart(request, user, null);
        removeFromWishlist(productId, user);
    }
}

