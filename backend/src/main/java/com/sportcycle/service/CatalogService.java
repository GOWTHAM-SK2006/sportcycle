package com.sportcycle.service;

import com.sportcycle.dto.BrandDto;
import com.sportcycle.dto.CategoryDto;
import com.sportcycle.dto.SportDto;
import com.sportcycle.entity.Brand;
import com.sportcycle.entity.Category;
import com.sportcycle.entity.Sport;
import com.sportcycle.exception.ResourceNotFoundException;
import com.sportcycle.repository.BrandRepository;
import com.sportcycle.repository.CategoryRepository;
import com.sportcycle.repository.SportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final SportRepository sportRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Transactional(readOnly = true)
    public List<SportDto> getAllSports() {
        return sportRepository.findByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::mapSportToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SportDto getSportBySlug(String slug) {
        Sport sport = sportRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Sport not found with slug: " + slug));
        return mapSportToDto(sport);
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getCategoriesBySportSlug(String sportSlug) {
        Sport sport = sportRepository.findBySlug(sportSlug)
                .orElseThrow(() -> new ResourceNotFoundException("Sport not found with slug: " + sportSlug));

        return categoryRepository.findBySportIdAndIsActiveTrueOrderByDisplayOrderAsc(sport.getId())
                .stream()
                .map(this::mapCategoryToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapCategoryToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BrandDto> getAllBrands() {
        return brandRepository.findAll()
                .stream()
                .map(this::mapBrandToDto)
                .collect(Collectors.toList());
    }

    private SportDto mapSportToDto(Sport sport) {
        List<CategoryDto> categoryDtos = null;
        if (sport.getCategories() != null) {
            categoryDtos = sport.getCategories().stream()
                    .filter(Category::getIsActive)
                    .map(this::mapCategoryToDto)
                    .collect(Collectors.toList());
        }

        return SportDto.builder()
                .id(sport.getId())
                .name(sport.getName())
                .slug(sport.getSlug())
                .description(sport.getDescription())
                .iconUrl(sport.getIconUrl())
                .imageUrl(sport.getImageUrl())
                .displayOrder(sport.getDisplayOrder())
                .categories(categoryDtos)
                .build();
    }

    private CategoryDto mapCategoryToDto(Category c) {
        return CategoryDto.builder()
                .id(c.getId())
                .sportId(c.getSport().getId())
                .sportName(c.getSport().getName())
                .name(c.getName())
                .slug(c.getSlug())
                .description(c.getDescription())
                .imageUrl(c.getImageUrl())
                .displayOrder(c.getDisplayOrder())
                .build();
    }

    private BrandDto mapBrandToDto(Brand b) {
        return BrandDto.builder()
                .id(b.getId())
                .name(b.getName())
                .slug(b.getSlug())
                .logoUrl(b.getLogoUrl())
                .description(b.getDescription())
                .websiteUrl(b.getWebsiteUrl())
                .build();
    }
}

