package com.sportcycle.service;

import com.sportcycle.entity.AuditLog;
import com.sportcycle.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(String userEmail, String action, String resource, String resourceId, String ipAddress, String details) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .userEmail(userEmail)
                    .action(action)
                    .resource(resource)
                    .resourceId(resourceId)
                    .ipAddress(ipAddress)
                    .details(details)
                    .build();
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to write audit log: {}", e.getMessage());
        }
    }
}

