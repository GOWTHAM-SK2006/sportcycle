package com.sportcycle;

import com.sportcycle.dto.AuthResponse;
import com.sportcycle.dto.LoginRequest;
import com.sportcycle.dto.RegisterRequest;
import com.sportcycle.entity.Role;
import com.sportcycle.entity.User;
import com.sportcycle.repository.RoleRepository;
import com.sportcycle.repository.SellerRepository;
import com.sportcycle.repository.UserRepository;
import com.sportcycle.security.JwtTokenProvider;
import com.sportcycle.service.AuditService;
import com.sportcycle.service.AuthService;
import com.sportcycle.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private SellerRepository sellerRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenProvider tokenProvider;
    @Mock
    private NotificationService notificationService;
    @Mock
    private AuditService auditService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        Role role = Role.builder().id(1L).name("ROLE_CUSTOMER").build();
        sampleUser = User.builder()
                .id(1L)
                .fullName("Aarav Kumar")
                .email("aarav@test.com")
                .password("encoded_pass")
                .isActive(true)
                .roles(Set.of(role))
                .build();
    }

    @Test
    void testLoginSuccess() {
        LoginRequest req = new LoginRequest();
        req.setEmail("aarav@test.com");
        req.setPassword("secret123");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");
        when(tokenProvider.generateRefreshToken(anyString())).thenReturn("mock.refresh.token");
        when(userRepository.findByEmail("aarav@test.com")).thenReturn(Optional.of(sampleUser));

        AuthResponse resp = authService.login(req);

        assertNotNull(resp);
        assertEquals("mock.jwt.token", resp.getToken());
        assertEquals("aarav@test.com", resp.getUser().getEmail());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Aarav Kumar");
        req.setEmail("newuser@test.com");
        req.setPassword("secret123");

        when(userRepository.existsByEmail("newuser@test.com")).thenReturn(false);
        when(roleRepository.findByName("ROLE_CUSTOMER")).thenReturn(Optional.of(Role.builder().name("ROLE_CUSTOMER").build()));
        when(passwordEncoder.encode("secret123")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");
        when(tokenProvider.generateRefreshToken(anyString())).thenReturn("mock.refresh.token");

        AuthResponse resp = authService.register(req);

        assertNotNull(resp);
        assertEquals("mock.jwt.token", resp.getToken());
    }
}

