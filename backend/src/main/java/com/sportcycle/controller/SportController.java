package com.sportcycle.controller;

import com.sportcycle.dto.ApiResponse;
import com.sportcycle.dto.CategoryDto;
import com.sportcycle.dto.SportDto;
import com.sportcycle.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sports")
@RequiredArgsConstructor
@Tag(name = "Sports Catalog", description = "Browse sports and categories")
public class SportController {

    private final CatalogService catalogService;

    @GetMapping
    @Operation(summary = "List all active sports with categories")
    public ResponseEntity<ApiResponse<List<SportDto>>> getAllSports() {
        return ResponseEntity.ok(ApiResponse.ok(catalogService.getAllSports()));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get sport details by slug")
    public ResponseEntity<ApiResponse<SportDto>> getSportBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(catalogService.getSportBySlug(slug)));
    }

    @GetMapping("/{slug}/categories")
    @Operation(summary = "Get categories under a sport by sport slug")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategoriesBySport(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(catalogService.getCategoriesBySportSlug(slug)));
    }
}

