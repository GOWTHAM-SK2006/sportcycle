package com.sportcycle.controller;

import com.sportcycle.dto.ApiResponse;
import com.sportcycle.service.SupabaseStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
@Tag(name = "Media Storage", description = "Supabase storage product image uploads")
public class MediaController {

    private final SupabaseStorageService supabaseStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyAuthority('ROLE_SELLER', 'ROLE_ADMIN', 'ROLE_CLUB_ADMIN')")
    @Operation(summary = "Upload image to Supabase Storage")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("File cannot be empty"));
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/"))) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Only image files are allowed"));
        }

        if (file.getSize() > 10 * 1024 * 1024) { // 10MB limit
            return ResponseEntity.badRequest().body(ApiResponse.error("File size cannot exceed 10MB"));
        }

        String publicUrl = supabaseStorageService.uploadImage(file.getBytes(), file.getOriginalFilename(), contentType);

        return ResponseEntity.ok(ApiResponse.ok(Map.of("url", publicUrl), "Image uploaded successfully"));
    }
}

