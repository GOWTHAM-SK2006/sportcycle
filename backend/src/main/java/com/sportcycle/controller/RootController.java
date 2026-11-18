package com.sportcycle.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/status")
@Tag(name = "Health", description = "Backend system health and diagnostics")
public class RootController {

    @GetMapping
    @Operation(summary = "System Health Status", description = "Returns service health and operational metadata")
    public ResponseEntity<Map<String, Object>> getStatus() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "SPORTCYCLE REST API",
                "version", "1.0.0",
                "timestamp", Instant.now().toString()
        ));
    }
}
