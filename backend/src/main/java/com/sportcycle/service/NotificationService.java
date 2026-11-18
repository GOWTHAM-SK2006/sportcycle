package com.sportcycle.service;

import com.sportcycle.dto.NotificationDto;
import com.sportcycle.entity.Notification;
import com.sportcycle.entity.User;
import com.sportcycle.entity.enums.NotificationType;
import com.sportcycle.exception.ResourceNotFoundException;
import com.sportcycle.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(User user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .filter(n -> !n.getIsRead())
                .peek(n -> n.setIsRead(true))
                .collect(Collectors.toList());

        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void createNotification(User recipient, String title, String message, NotificationType type, String linkUrl) {
        Notification notification = Notification.builder()
                .user(recipient)
                .title(title)
                .message(message)
                .type(type)
                .linkUrl(linkUrl)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    private NotificationDto mapToDto(Notification entity) {
        return NotificationDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .message(entity.getMessage())
                .type(entity.getType())
                .isRead(entity.getIsRead())
                .linkUrl(entity.getLinkUrl())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}

