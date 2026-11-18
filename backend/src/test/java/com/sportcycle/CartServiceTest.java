package com.sportcycle;

import com.sportcycle.dto.AddToCartRequest;
import com.sportcycle.dto.CartDto;
import com.sportcycle.entity.Cart;
import com.sportcycle.entity.CartItem;
import com.sportcycle.entity.Product;
import com.sportcycle.entity.User;
import com.sportcycle.entity.enums.ProductStatus;
import com.sportcycle.exception.InsufficientStockException;
import com.sportcycle.repository.CartItemRepository;
import com.sportcycle.repository.CartRepository;
import com.sportcycle.repository.ProductRepository;
import com.sportcycle.service.CartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Product product;
    private Cart cart;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).email("user@test.com").build();
        product = Product.builder()
                .id(10L)
                .title("Yonex Astrox 88D Pro")
                .sellingPrice(new BigDecimal("13590.00"))
                .stockQuantity(5)
                .status(ProductStatus.ACTIVE)
                .build();
        cart = Cart.builder().id(100L).user(user).build();
    }

    @Test
    void testAddToCartSuccess() {
        AddToCartRequest req = new AddToCartRequest();
        req.setProductId(10L);
        req.setQuantity(2);
        req.setSelectedSize("4U/G5");

        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartIdAndProductIdAndSelectedSize(100L, 10L, "4U/G5")).thenReturn(Optional.empty());

        CartItem savedItem = CartItem.builder()
                .id(1L)
                .cart(cart)
                .product(product)
                .quantity(2)
                .selectedSize("4U/G5")
                .priceAtAddition(new BigDecimal("13590.00"))
                .build();

        when(cartItemRepository.findByCartId(100L)).thenReturn(List.of(savedItem));
        when(cartRepository.findById(100L)).thenReturn(Optional.of(cart));

        CartDto result = cartService.addToCart(req, user, null);

        assertNotNull(result);
        assertEquals(2, result.getTotalItems());
        assertEquals(new BigDecimal("27180.00"), result.getSubtotal());
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    void testAddToCartThrowsInsufficientStock() {
        AddToCartRequest req = new AddToCartRequest();
        req.setProductId(10L);
        req.setQuantity(10); // Exceeds product stock 5

        when(productRepository.findById(10L)).thenReturn(Optional.of(product));

        assertThrows(InsufficientStockException.class, () -> cartService.addToCart(req, user, null));
        verify(cartItemRepository, never()).save(any(CartItem.class));
    }
}

