package com.sportcycle.service;

import com.sportcycle.dto.AddressDto;
import com.sportcycle.dto.AddressRequest;
import com.sportcycle.entity.User;
import com.sportcycle.entity.UserAddress;
import com.sportcycle.exception.ResourceNotFoundException;
import com.sportcycle.repository.UserAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserAddressService {

    private final UserAddressRepository addressRepository;

    @Transactional(readOnly = true)
    public List<AddressDto> getUserAddresses(User user) {
        return addressRepository.findByUserIdOrderByIsDefaultDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDto addAddress(User user, AddressRequest request) {
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            resetDefaultAddresses(user.getId());
        }

        UserAddress address = UserAddress.builder()
                .user(user)
                .recipientName(request.getRecipientName())
                .phone(request.getPhone())
                .street(request.getStreet())
                .landmark(request.getLandmark())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .country(request.getCountry() != null ? request.getCountry() : "India")
                .isDefault(Boolean.TRUE.equals(request.getIsDefault()))
                .addressType(request.getAddressType() != null ? request.getAddressType() : "HOME")
                .build();

        return mapToDto(addressRepository.save(address));
    }

    @Transactional
    public AddressDto updateAddress(User user, Long addressId, AddressRequest request) {
        UserAddress address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            resetDefaultAddresses(user.getId());
        }

        address.setRecipientName(request.getRecipientName());
        address.setPhone(request.getPhone());
        address.setStreet(request.getStreet());
        address.setLandmark(request.getLandmark());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        if (request.getCountry() != null) address.setCountry(request.getCountry());
        if (request.getIsDefault() != null) address.setIsDefault(request.getIsDefault());
        if (request.getAddressType() != null) address.setAddressType(request.getAddressType());

        return mapToDto(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(User user, Long addressId) {
        UserAddress address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        addressRepository.delete(address);
    }

    @Transactional
    public AddressDto setDefaultAddress(User user, Long addressId) {
        UserAddress address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        resetDefaultAddresses(user.getId());
        address.setIsDefault(true);
        return mapToDto(addressRepository.save(address));
    }

    private void resetDefaultAddresses(Long userId) {
        List<UserAddress> addresses = addressRepository.findByUserIdOrderByIsDefaultDesc(userId);
        for (UserAddress a : addresses) {
            if (a.getIsDefault()) {
                a.setIsDefault(false);
                addressRepository.save(a);
            }
        }
    }

    public AddressDto mapToDto(UserAddress entity) {
        return AddressDto.builder()
                .id(entity.getId())
                .recipientName(entity.getRecipientName())
                .phone(entity.getPhone())
                .street(entity.getStreet())
                .landmark(entity.getLandmark())
                .city(entity.getCity())
                .state(entity.getState())
                .postalCode(entity.getPostalCode())
                .country(entity.getCountry())
                .isDefault(entity.getIsDefault())
                .addressType(entity.getAddressType())
                .build();
    }
}

