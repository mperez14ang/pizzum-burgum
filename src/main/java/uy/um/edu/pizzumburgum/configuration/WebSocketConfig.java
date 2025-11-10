package uy.um.edu.pizzumburgum.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 👇 Este endpoint debe coincidir con el de tu frontend
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // <-- importante si usas SockJS
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Prefijo de los topics (suscripciones)
        registry.enableSimpleBroker("/topic");
        // Prefijo para los mensajes enviados desde el cliente al servidor
        registry.setApplicationDestinationPrefixes("/app");
    }
}