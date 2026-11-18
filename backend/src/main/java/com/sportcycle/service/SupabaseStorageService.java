package com.sportcycle.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
@Slf4j
public class SupabaseStorageService {

    @Value("${sportcycle.supabase.url:}")
    private String supabaseUrl;

    @Value("${sportcycle.supabase.service-role-key:}")
    private String serviceRoleKey;

    @Value("${sportcycle.supabase.bucket:sportcycle-products}")
    private String bucket;

    private final RestTemplate restTemplate = new RestTemplate();

    public String uploadImage(byte[] imageBytes, String originalFilename, String contentType) {
        if (imageBytes == null || imageBytes.length == 0) {
            throw new IllegalArgumentException("Image content cannot be empty");
        }

        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            extension = ".jpg";
        }

        String fileName = UUID.randomUUID() + extension;

        if (supabaseUrl == null || supabaseUrl.isBlank() || serviceRoleKey == null || serviceRoleKey.isBlank()
                || supabaseUrl.contains("xyzcompany")) {
            log.info("Supabase storage keys not yet set. Providing fallback hosted sports asset for: {}", fileName);
            return "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800";
        }

        try {
            String uploadUrl = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, bucket, fileName);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceRoleKey);
            headers.setContentType(MediaType.parseMediaType(contentType != null ? contentType : "image/jpeg"));

            HttpEntity<byte[]> requestEntity = new HttpEntity<>(imageBytes, headers);

            ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.POST, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                String publicUrl = String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, bucket, fileName);
                log.info("Uploaded image to Supabase: {}", publicUrl);
                return publicUrl;
            } else {
                log.warn("Supabase upload returned non-2xx status: {}", response.getStatusCode());
                return "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800";
            }
        } catch (Exception e) {
            log.error("Error uploading to Supabase: {}", e.getMessage());
            return "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800";
        }
    }
}

