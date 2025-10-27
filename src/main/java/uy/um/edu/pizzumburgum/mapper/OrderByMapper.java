package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.request.OrderByRequest;
import uy.um.edu.pizzumburgum.dto.response.OrderByResponse;
import uy.um.edu.pizzumburgum.dto.request.OrderHasCreationsRequest;
import uy.um.edu.pizzumburgum.dto.response.OrderHasCreationsResponse;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.OrderBy;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;

import java.util.HashSet;
import java.util.Set;

public class OrderByMapper {


    // To OrderByCreateRequest -> OrderBy
    public static OrderBy toOrderBy(OrderByRequest orderByRequest) {
        return OrderBy.builder()
                .state(orderByRequest.getState())
                .build();
    }

    // To OrderBy -> OrderByResponse
    public static OrderByResponse toOrderByDto(OrderBy orderBy) {
        Client client = orderBy.getClient();

        Set<OrderHasCreationsResponse> orderHasCreationsResponses = new HashSet<>();
        for (OrderHasCreations orderHasCreations : orderBy.getCreations()){
            orderHasCreationsResponses.add(OrderHasCreationsMapper.toOrderHasCreationsDto(orderHasCreations));
        }

        return OrderByResponse.builder()
                .id(orderBy.getId())
                .state(orderBy.getState())
                .clientEmail(client.getEmail())
                .clientName(client.getFirstName())
                .address(AddressMapper.toAddressResponse(orderBy.getAddress()))
                .creations(orderHasCreationsResponses)
                .build();
    }
}
