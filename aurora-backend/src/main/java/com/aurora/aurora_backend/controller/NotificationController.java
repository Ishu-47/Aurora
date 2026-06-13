package com.aurora.aurora_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aurora.aurora_backend.dto.NotificationResponseDTO;
import com.aurora.aurora_backend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationResponseDTO> getNotifications() {
        return notificationService.getNotifications();
    }

    @PutMapping("/{id}/read")
    public void markAsRead(
            @PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @PutMapping("/read-all")
    public void markAllAsRead() {
        notificationService.markAllAsRead();
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount() {

        return Map.of("count", notificationService.getUnreadCount());
    }
}
