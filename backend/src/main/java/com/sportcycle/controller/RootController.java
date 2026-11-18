package com.sportcycle.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@Tag(name = "Root", description = "Root health and API status")
public class RootController {

    @GetMapping("/")
    @Operation(summary = "API Health & Status", description = "Returns service health, version, and Swagger documentation links")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "SPORTCYCLE REST API",
                "version", "1.0.0",
                "tagline", "Gear. Play. Repeat.",
                "timestamp", Instant.now().toString(),
                "swaggerUi", "/api/v1/swagger-ui.html",
                "apiDocs", "/api/v1/v3/api-docs",
                "productsApi", "/api/v1/products",
                "sportsApi", "/api/v1/sports"
        ));
    }
}
