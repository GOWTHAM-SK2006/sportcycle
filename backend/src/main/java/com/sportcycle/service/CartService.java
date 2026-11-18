package com.sportcycle.service;

import com.sportcycle.dto.AddToCartRequest;
import com.sportcycle.dto.CartDto;
import com.sportcycle.dto.CartItemDto;
import com.sportcycle.dto.UpdateCartItemRequest;
import com.sportcycle.entity.Cart;
import com.sportcycle.entity.CartItem;
import com.sportcycle.entity.Product;
import com.sportcycle.entity.User;
import com.sportcycle.entity.enums.ProductStatus;
import com.sportcycle.exception.BadRequestException;
import com.sportcycle.exception.InsufficientStockException;
import com.sportcycle.exception.ResourceNotFoundException;
import com.sportcycle.repository.CartItemRepository;
import com.sportcycle.repository.CartRepository;
import com.sportcycle.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Cart getOrCreateCart(User user, String sessionId) {
        if (user != null) {
            return cartRepository.findByUserId(user.getId())
                    .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
        } else if (sessionId != null && !sessionId.isBlank()) {
            return cartRepository.findBySessionId(sessionId)
                    .orElseGet(() -> cartRepository.save(Cart.builder().sessionId(sessionId).build()));
        } else {
            throw new BadRequestException("Either authenticated user or session ID is required for cart");
        }
    }

    @Transactional(readOnly = true)
    public CartDto getCartDto(User user, String sessionId) {
        Optional<Cart> cartOpt;
        if (user != null) {
            cartOpt = cartRepository.findByUserId(user.getId());
        } else if (sessionId != null && !sessionId.isBlank()) {
            cartOpt = cartRepository.findBySessionId(sessionId);
        } else {
            return emptyCart();
        }

        return cartOpt.map(this::calculateAndMapCart).orElseGet(this::emptyCart);
    }

    @Transactional
    public CartDto addToCart(AddToCartRequest request, User user, String sessionId) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new BadRequestException("This product is currently unavailable");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new InsufficientStockException("Only " + product.getStockQuantity() + " item(s) available in stock");
        }

        Cart cart = getOrCreateCart(user, sessionId);

        String size = request.getSelectedSize() != null ? request.getSelectedSize().trim() : "";
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductIdAndSelectedSize(
                cart.getId(), product.getId(), size
        );

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            if (product.getStockQuantity() < newQuantity) {
                throw new InsufficientStockException("Cannot add more. Max stock available is " + product.getStockQuantity());
            }
            item.setQuantity(newQuantity);
            item.setPriceAtAddition(product.getSellingPrice()); // Server-side pricing recalculation
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .selectedSize(size)
                    .priceAtAddition(product.getSellingPrice())
                    .build();
            cartItemRepository.save(newItem);
        }

        return calculateAndMapCart(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Transactional
    public CartDto updateCartItem(Long itemId, UpdateCartItemRequest request, User user, String sessionId) {
        Cart cart = getOrCreateCart(user, sessionId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to this cart");
        }

        if (request.getQuantity() <= 0) {
            cartItemRepository.delete(item);
        } else {
            Product product = item.getProduct();
            if (product.getStockQuantity() < request.getQuantity()) {
                throw new InsufficientStockException("Only " + product.getStockQuantity() + " available in stock");
            }
            item.setQuantity(request.getQuantity());
            if (request.getSelectedSize() != null) {
                item.setSelectedSize(request.getSelectedSize().trim());
            }
            item.setPriceAtAddition(product.getSellingPrice());
            cartItemRepository.save(item);
        }

        return calculateAndMapCart(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Transactional
    public CartDto removeCartItem(Long itemId, User user, String sessionId) {
        Cart cart = getOrCreateCart(user, sessionId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to this cart");
        }

        cartItemRepository.delete(item);
        return calculateAndMapCart(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Transactional
    public void clearCart(User user, String sessionId) {
        Cart cart = getOrCreateCart(user, sessionId);
        cartItemRepository.deleteByCartId(cart.getId());
    }

    @Transactional
    public CartDto mergeGuestCart(User user, String guestSessionId) {
        if (guestSessionId == null || guestSessionId.isBlank()) {
            return getCartDto(user, null);
        }

        Optional<Cart> guestCartOpt = cartRepository.findBySessionId(guestSessionId);
        if (guestCartOpt.isEmpty()) {
            return getCartDto(user, null);
        }

        Cart guestCart = guestCartOpt.get();
        Cart userCart = getOrCreateCart(user, null);

        List<CartItem> guestItems = cartItemRepository.findByCartId(guestCart.getId());
        for (CartItem gItem : guestItems) {
            Optional<CartItem> userItemOpt = cartItemRepository.findByCartIdAndProductIdAndSelectedSize(
                    userCart.getId(), gItem.getProduct().getId(), gItem.getSelectedSize()
            );

            if (userItemOpt.isPresent()) {
                CartItem uItem = userItemOpt.get();
                uItem.setQuantity(uItem.getQuantity() + gItem.getQuantity());
                uItem.setPriceAtAddition(gItem.getProduct().getSellingPrice());
                cartItemRepository.save(uItem);
            } else {
                CartItem newItem = CartItem.builder()
                        .cart(userCart)
                        .product(gItem.getProduct())
                        .quantity(gItem.getQuantity())
                        .selectedSize(gItem.getSelectedSize())
                        .priceAtAddition(gItem.getProduct().getSellingPrice())
                        .build();
                cartItemRepository.save(newItem);
            }
        }

        cartRepository.delete(guestCart);
        return calculateAndMapCart(cartRepository.findById(userCart.getId()).orElse(userCart));
    }

    public CartDto calculateAndMapCart(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        List<CartItemDto> itemDtos = new ArrayList<>();

        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : items) {
            Product p = item.getProduct();
            BigDecimal currentPrice = p.getSellingPrice(); // ALWAYS recalculate based on live product pricing
            BigDecimal itemTotal = currentPrice.multiply(new BigDecimal(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
            totalItems += item.getQuantity();

            String img = null;
            if (p.getImages() != null && !p.getImages().isEmpty()) {
                img = p.getImages().get(0).getImageUrl();
            }

            boolean inStock = p.getStatus() == ProductStatus.ACTIVE && p.getStockQuantity() >= item.getQuantity();

            itemDtos.add(CartItemDto.builder()
                    .id(item.getId())
                    .productId(p.getId())
                    .productTitle(p.getTitle())
                    .productSlug(p.getSlug())
                    .productImage(img)
                    .unitPrice(currentPrice)
                    .quantity(item.getQuantity())
                    .selectedSize(item.getSelectedSize())
                    .totalPrice(itemTotal)
                    .inStock(inStock)
                    .availableStock(p.getStockQuantity())
                    .build());
        }

        // Free shipping on orders above 999 INR, otherwise standard 99 INR shipping
        BigDecimal shipping = subtotal.compareTo(new BigDecimal("999")) >= 0 || subtotal.compareTo(BigDecimal.ZERO) == 0 ?
                BigDecimal.ZERO : new BigDecimal("99.00");
        BigDecimal discount = BigDecimal.ZERO;
        BigDecimal total = subtotal.add(shipping).subtract(discount);

        return CartDto.builder()
                .id(cart.getId())
                .items(itemDtos)
                .subtotal(subtotal)
                .discount(discount)
                .shipping(shipping)
                .total(total)
                .totalItems(totalItems)
                .build();
    }

    private CartDto emptyCart() {
        return CartDto.builder()
                .id(null)
                .items(List.of())
                .subtotal(BigDecimal.ZERO)
                .discount(BigDecimal.ZERO)
                .shipping(BigDecimal.ZERO)
                .total(BigDecimal.ZERO)
                .totalItems(0)
                .build();
    }
}

