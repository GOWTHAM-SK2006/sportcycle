package com.sportcycle.controller;

import com.sportcycle.dto.ApiResponse;
import com.sportcycle.dto.BrandDto;
import com.sportcycle.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
@Tag(name = "Brands", description = "Browse sports gear manufacturers and brands")
public class BrandController {

    private final CatalogService catalogService;

    @GetMapping
    @Operation(summary = "Get all sports brands")
    public ResponseEntity<ApiResponse<List<BrandDto>>> getAllBrands() {
        return ResponseEntity.ok(ApiResponse.ok(catalogService.getAllBrands()));
    }
}

