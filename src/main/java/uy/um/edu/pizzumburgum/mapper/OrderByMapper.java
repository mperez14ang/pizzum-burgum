package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.request.OrderByRequest;
import uy.um.edu.pizzumburgum.dto.response.OrderByResponse;
import uy.um.edu.pizzumburgum.dto.response.OrderHasCreationsResponse;
import uy.um.edu.pizzumburgum.entities.*;
import uy.um.edu.pizzumburgum.repository.AddressRepository;

import java.util.HashSet;
import java.util.Set;

public class OrderByMapper {


    // To OrderByCreateRequest -> OrderBy
    public static OrderBy toOrderBy(OrderByRequest orderByRequest, AddressRepository addressRepository) {
        Address address = addressRepository.findById(orderByRequest.getAddress())
                .orElseThrow(() -> new IllegalArgumentException("La dirección no existe"));

        return OrderBy.builder()
                .state(orderByRequest.getState())
                .deliveryCity(address.getCity())
                .deliveryStreet(address.getStreet())
                .deliveryPostalCode(address.getPostalCode())
                .build();
    }

    // To OrderBy -> OrderByResponse
    public static OrderByResponse toOrderByDto(OrderBy orderBy) {
        Client client = orderBy.getClient();

        Set<OrderHasCreationsResponse> orderHasCreationsResponses = new HashSet<>();
        for (OrderHasCreations orderHasCreations : orderBy.getCreations()){
            orderHasCreationsResponses.add(OrderHasCreationsMapper.toOrderHasCreationsDto(orderHasCreations));
        }

        boolean creationsAvailable = orderBy.getCreations().stream()
                .map(OrderHasCreations::getCreation)
                .allMatch(Creation::getAvailable);

        return OrderByResponse.builder()
                .id(orderBy.getId())
                .state(orderBy.getState())
                .clientEmail(client.getEmail())
                .clientName(client.getFirstName())
                .deliveryStreet(orderBy.getDeliveryStreet())
                .deliveryPostalCode(orderBy.getDeliveryPostalCode())
                .deliveryCity(orderBy.getDeliveryCity())
                .creations(orderHasCreationsResponses)
                .available(creationsAvailable)
                .build();
    }
}
