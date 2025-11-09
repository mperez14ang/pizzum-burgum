package uy.um.edu.pizzumburgum.services;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.shared.OrderStatusUpdateDto;
import uy.um.edu.pizzumburgum.entities.OrderBy;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OrderNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Notifica a todos los clientes suscritos sobre el cambio de estado de una orden
     */
    public void notifyOrderStatusChange(OrderBy order) {
        OrderStatusUpdateDto update = OrderStatusUpdateDto.builder()
                .orderId(order.getId())
                .state(order.getState())
                .updatedAt(LocalDateTime.now())
                .build();

        // Envía a un topic específico de la orden
        messagingTemplate.convertAndSend(
                "/topic/order/" + order.getId(),
                update
        );

        // También envía a un topic general para dashboards que muestren todas las órdenes
        messagingTemplate.convertAndSend(
                "/topic/orders",
                update
        );
    }
}