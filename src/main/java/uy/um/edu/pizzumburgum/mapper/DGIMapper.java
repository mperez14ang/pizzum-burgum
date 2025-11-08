package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.response.DGIOrderResponse;
import uy.um.edu.pizzumburgum.dto.response.OrderHasCreationsResponse;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.OrderBy;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

public class DGIMapper {

    /**
     * Convierte una entidad OrderBy a DGIOrderResponse
     * Incluye información completa del cliente y la orden para reportes fiscales
     */
    public static DGIOrderResponse toDGIOrderResponse(OrderBy orderBy) {
        Client client = orderBy.getClient();

        // Convertir las creaciones de la orden
        Set<OrderHasCreationsResponse> orderHasCreationsResponses = new HashSet<>();
        for (OrderHasCreations orderHasCreations : orderBy.getCreations()){
            orderHasCreationsResponses.add(OrderHasCreationsMapper.toOrderHasCreationsDto(orderHasCreations));
        }

        // Calcular precio total
        if (orderBy.getExtraAmount() == null) {
            orderBy.setExtraAmount(BigDecimal.ZERO);
        }

        // Obtener monto total (suma de productos*quantity)*creation_quantity + extra
        BigDecimal totalPrice = orderBy.getCreations().stream()
                .flatMap(c -> c.getCreation().getProducts().stream()
                        .map(product -> product.getProduct().getPrice()
                                .multiply(BigDecimal.valueOf(product.getQuantity()))
                                .multiply(BigDecimal.valueOf(c.getQuantity()))))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .add(orderBy.getExtraAmount());

        return DGIOrderResponse.builder()
                .id(orderBy.getId())
                .state(orderBy.getState())
                .createdAt(orderBy.getDateCreated())
                .deliveryStreet(orderBy.getDeliveryStreet())
                .deliveryCity(orderBy.getDeliveryCity())
                .deliveryPostalCode(orderBy.getDeliveryPostalCode())
                .creations(orderHasCreationsResponses)
                .extraAmount(orderBy.getExtraAmount())
                .totalPrice(totalPrice)
                .clientEmail(client.getEmail())
                .clientName(client.getFirstName() + " " + client.getLastName())
                .clientDni(client.getDni())
                .notes(orderBy.getNotes())
                .build();
    }
}