package com.aurora.aurora_backend.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.NotificationEventDTO;
import com.aurora.aurora_backend.dto.NotificationResponseDTO;
import com.aurora.aurora_backend.entity.Notification;
import com.aurora.aurora_backend.entity.NotificationType;
import com.aurora.aurora_backend.entity.Post;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.NotificationRepository;
import com.aurora.aurora_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

        private final NotificationWebsocketService notificationWebsocketService;
        private final NotificationRepository notificationRepository;
        private final UserRepository userRepository;

        public Notification createNotification(User recipient, User sender, NotificationType type, String message,
                        Post post) {
                if (recipient.getId().equals(sender.getId())) {
                        return null;
                }
                Notification notification = Notification.builder()
                                .recipient(recipient)
                                .sender(sender)
                                .type(type)
                                .message(message)
                                .post(post)
                                .build();

                Notification saved = notificationRepository.save(notification);
                NotificationResponseDTO response = mapToDTO(notification);
                long unreadCount = notificationRepository.countByRecipientAndReadFalse(recipient);
                NotificationEventDTO event = new NotificationEventDTO(response, unreadCount);
                notificationWebsocketService.sendNotification(recipient.getEmail(), event);
                return saved;
        }

        public List<NotificationResponseDTO> getNotifications() {
                User currentUser = getCurrentUser();

                return notificationRepository
                                .findByRecipientOrderByCreatedAtDesc(currentUser)
                                .stream()
                                .map(this::mapToDTO)
                                .toList();
        }

        public void markAsRead(Long notificationId) {
                Notification notification = notificationRepository
                                .findById(notificationId)
                                .orElseThrow(() -> new RuntimeException("Notification not found"));
                notification.setRead(true);
                notificationRepository.save(notification);
        }

        public void markAllAsRead() {

                User currentUser = getCurrentUser();
                List<Notification> notifications = notificationRepository
                                .findByRecipientOrderByCreatedAtDesc(currentUser);

                notifications.forEach(notification -> notification.setRead(true));

                notificationRepository.saveAll(notifications);
        }

        public long getUnreadCount() {

                User currentUser = getCurrentUser();
                return notificationRepository.countByRecipientAndReadFalse(currentUser);
        }

        public NotificationResponseDTO mapToDTO(Notification notification) {

                return new NotificationResponseDTO(
                                notification.getId(),
                                notification.getSender()
                                                .getDisplayUsername(),
                                notification.getType(),
                                notification.getMessage(),
                                notification.getPost() != null
                                                ? notification.getPost().getId()
                                                : null,
                                notification.isRead(),
                                notification.getCreatedAt());
        }

        private User getCurrentUser() {
                String email = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();
                return userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
        }
}