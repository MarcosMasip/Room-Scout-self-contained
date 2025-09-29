package com.room_scout.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("!local")
public class RabbitMQConfig {

    private static final String EMAIL_QUEUE = "emailQueue";
    private static final String EMAIL_EXCHANGE = "emailExchange";
    private static final String EMAIL_ROUTING_KEY = "emailRoutingKey";

    @Bean
    Queue emailQueue() {
        return new Queue(EMAIL_QUEUE, true);
    }

    @Bean
    DirectExchange emailExchange() {
        return new DirectExchange(EMAIL_EXCHANGE);
    }

    @Bean
    Binding emailBinding(Queue emailQueue, DirectExchange emailExchange) {
        return BindingBuilder.bind(emailQueue).to(emailExchange).with(EMAIL_ROUTING_KEY);
    }

    @Bean
     Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, Jackson2JsonMessageConverter converter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(converter);
        return rabbitTemplate;
    }

    public String getExchange() {
        return EMAIL_EXCHANGE;
    }

    public String getRoutingKey() {
        return EMAIL_ROUTING_KEY;
    }
}
