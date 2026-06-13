package com.aurora.aurora_backend.config;

import java.time.Duration;

import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.JacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.aurora.aurora_backend.redis.ChatMessageEvent;
import com.aurora.aurora_backend.redis.ChatMessageSubscriber;
import com.aurora.aurora_backend.redis.RedisChannels;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, ChatMessageEvent> redisTemplate(RedisConnectionFactory connectionFactory) {

        RedisTemplate<String, ChatMessageEvent> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        JacksonJsonRedisSerializer<ChatMessageEvent> serializer = new JacksonJsonRedisSerializer<>(
                ChatMessageEvent.class);

        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        template.setValueSerializer(serializer);
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();

        return template;
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {

        RedisCacheConfiguration configuration = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(configuration)
                .build();
    }

    @Bean
    public MessageListenerAdapter chatListenerAdapter(ChatMessageSubscriber subscriber) {

        JacksonJsonRedisSerializer<ChatMessageEvent> serializer = new JacksonJsonRedisSerializer<>(
                ChatMessageEvent.class);

        MessageListenerAdapter adapter = new MessageListenerAdapter(subscriber, "receive");

        adapter.setSerializer(serializer);

        return adapter;
    }

    @Bean
    public RedisMessageListenerContainer redisContainer(RedisConnectionFactory connectionFactory,
            MessageListenerAdapter chatListenerAdapter) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();

        container.setConnectionFactory(connectionFactory);

        container.addMessageListener(chatListenerAdapter, new ChannelTopic(RedisChannels.CHAT_CHANNEL));

        return container;
    }
}