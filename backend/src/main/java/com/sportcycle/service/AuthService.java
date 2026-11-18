package com.sportcycle.service;

import com.sportcycle.dto.*;
import com.sportcycle.entity.Role;
import com.sportcycle.entity.Seller;
import com.sportcycle.entity.User;
import com.sportcycle.entity.enums.NotificationType;
import com.sportcycle.entity.enums.SellerType;
import com.sportcycle.exception.BadRequestException;
import com.sportcycle.exception.ResourceNotFoundException;
import com.sportcycle.exception.UnauthorizedException;
import com.sportcycle.repository.RoleRepository;
import com.sportcycle.repository.SellerRepository;
import com.sportcycle.repository.UserRepository;
import com.sportcycle.security.JwtTokenProvider;
import com.sportcycle.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SellerRepository sellerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;
    private final AuditService auditService;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(request.getEmail().toLowerCase().trim());

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        auditService.log(user.getEmail(), "LOGIN", "User", user.getId().toString(), null, "Successful login");

        return AuthResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .user(mapToProfileDto(user))
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email address is already in use.");
        }

        Set<Role> roles = new HashSet<>();
        Role customerRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_CUSTOMER").build()));
        roles.add(customerRole);

        boolean isSeller = "SELLER".equalsIgnoreCase(request.getRole());
        if (isSeller) {
            Role sellerRole = roleRepository.findByName("ROLE_SELLER")
                    .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_SELLER").build()));
            roles.add(sellerRole);
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .isActive(true)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        if (isSeller) {
            Seller seller = Seller.builder()
                    .user(savedUser)
                    .businessName(request.getFullName() + "'s Sports Gear")
                    .sellerType(SellerType.INDIVIDUAL)
                    .isVerified(false)
                    .phone(request.getPhone())
                    .build();
            sellerRepository.save(seller);
        }

        notificationService.createNotification(
                savedUser,
                "Welcome to SportCycle!",
                "Your account has been created. Start browsing gear or list your own equipment.",
                NotificationType.SYSTEM,
                "/products"
        );

        auditService.log(savedUser.getEmail(), "REGISTER", "User", savedUser.getId().toString(), null, "User registered with roles: " + roles);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(email);

        return AuthResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .user(mapToProfileDto(savedUser))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        String email = tokenProvider.getEmailFromToken(request.getRefreshToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (!user.getIsActive()) {
            throw new UnauthorizedException("Account is disabled");
        }

        String roles = user.getRoles().stream().map(Role::getName).collect(Collectors.joining(","));
        String newAccessToken = tokenProvider.generateTokenFromEmail(user.getEmail(), user.getId(), roles);
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .token(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(mapToProfileDto(user))
                .build();
    }

    @Transactional(readOnly = true)
    public UserProfileDto getCurrentUserProfile(User user) {
        return mapToProfileDto(user);
    }

    @Transactional
    public UserProfileDto updateProfile(User user, UpdateProfileRequest request) {
        user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        User updated = userRepository.save(user);
        return mapToProfileDto(updated);
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        auditService.log(user.getEmail(), "CHANGE_PASSWORD", "User", user.getId().toString(), null, "Password updated");
    }

    public UserProfileDto mapToProfileDto(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return UserProfileDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .roles(roleNames)
                .isActive(user.getIsActive())
                .build();
    }
}

