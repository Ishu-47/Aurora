package com.aurora.aurora_backend.redis;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatMessagePublisher {

    private final RedisTemplate<String, ChatMessageEvent> redisTemplate;

    public void publish(ChatMessageEvent event) {

        System.out.println("Publishing event: " + event);

        redisTemplate.convertAndSend(
                RedisChannels.CHAT_CHANNEL,
                event);
    }
}