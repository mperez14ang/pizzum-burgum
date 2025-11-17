package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.response.DGIOrderResponse;
import uy.um.edu.pizzumburgum.dto.response.OrderByResponse;
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
        OrderByResponse orderByDto = OrderByMapper.toOrderByDto(orderBy);

        BigDecimal totalPriceWithExtra = orderByDto.getTotalPrice()
                .add(orderBy.getExtraAmount() != null ? orderBy.getExtraAmount() : BigDecimal.ZERO);

        return DGIOrderResponse.builder()
                .id(orderBy.getId())
                .state(orderBy.getState())
                .dateCreated(orderBy.getDateCreated())
                .deliveryStreet(orderBy.getDeliveryStreet())
                .deliveryCity(orderBy.getDeliveryCity())
                .deliveryPostalCode(orderBy.getDeliveryPostalCode())
                .totalPrice(totalPriceWithExtra)
                .clientEmail(orderByDto.getClientEmail())
                .clientName(orderBy.getClient().getFirstName() + " " + orderBy.getClient().getLastName())
                .clientDni(orderBy.getClient().getDni())
                .notes(orderBy.getNotes())
                .build();
    }
}