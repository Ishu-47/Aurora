package com.aurora.aurora_backend.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.aurora.aurora_backend.dto.NotificationResponseDTO;
import com.aurora.aurora_backend.entity.Notification;
import com.aurora.aurora_backend.entity.NotificationType;
import com.aurora.aurora_backend.entity.User;
import com.aurora.aurora_backend.repository.NotificationRepository;
import com.aurora.aurora_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

        private final NotificationRepository notificationRepository;
        private final UserRepository userRepository;

        public void createNotification(User recipient, User sender, NotificationType type, String message) {
                if (recipient.getId().equals(sender.getId())) {
                        return;
                }
                Notification notification = Notification.builder()
                                .recipient(recipient)
                                .sender(sender)
                                .type(type)
                                .message(message)
                                .build();
                notificationRepository.save(notification);
        }

        public List<NotificationResponseDTO> getNotifications() {
                String email = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                User currentUser = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return notificationRepository
                                .findByRecipientOrderByCreatedAtDesc(currentUser)
                                .stream()
                                .map(this::mapToDTO)
                                .toList();
        }

        public void markAsRead(Long notificationId) {

                Notification notification = notificationRepository.findById(notificationId)
                                .orElseThrow(() -> new RuntimeException("Notification not found"));

                notification.setRead(true);

                notificationRepository.save(notification);
        }

        public void markAllAsRead() {
                String email = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                User currentUser = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Notification> notifications = notificationRepository
                                .findByRecipientOrderByCreatedAtDesc(currentUser);

                notifications.forEach(notification -> notification.setRead(true));

                notificationRepository.saveAll(notifications);
        }

        public long getUnreadCount() {
                String email = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                User currentUser = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return notificationRepository
                                .countByRecipientAndReadFalse(currentUser);
        }

        private NotificationResponseDTO mapToDTO(Notification notification) {
                return new NotificationResponseDTO(
                                notification.getId(),
                                notification.getSender().getDisplayUsername(),
                                notification.getType(),
                                notification.getMessage(),
                                notification.isRead(),
                                notification.getCreatedAt());
        }
}
