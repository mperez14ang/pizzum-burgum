package uy.um.edu.pizzumburgum.mapper;

import lombok.extern.slf4j.Slf4j;
import uy.um.edu.pizzumburgum.dto.request.OrderByRequest;
import uy.um.edu.pizzumburgum.dto.response.OrderByResponse;
import uy.um.edu.pizzumburgum.dto.response.OrderHasCreationsResponse;
import uy.um.edu.pizzumburgum.entities.*;
import uy.um.edu.pizzumburgum.repository.AddressRepository;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Slf4j
public class OrderByMapper {


    // To OrderByCreateRequest -> OrderBy
    public static OrderBy toOrderBy(OrderByRequest orderByRequest, AddressRepository addressRepository) {
        Address address = addressRepository.findById(orderByRequest.getAddress())
                .orElseThrow(() -> new IllegalArgumentException("La dirección no existe"));

        return OrderBy.builder()
                .state(orderByRequest.getState())
                .dateCreated(java.time.LocalDate.now())
                .deliveryCity(address.getCity())
                .deliveryStreet(address.getStreet())
                .deliveryPostalCode(address.getPostalCode())
                .extraAmount(orderByRequest.getExtraAmount())
                .notes(orderByRequest.getNotes())
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

        // Total Price
        if (orderBy.getExtraAmount() == null) {
            orderBy.setExtraAmount(BigDecimal.ZERO);
        }

        // Si el pedido está cancelado, el precio total es 0
        BigDecimal totalPrice;
        if (orderBy.getState().equals(OrderState.CANCELLED)) {
            totalPrice = BigDecimal.ZERO;
        }
        // Si el pedido todavia no esta pagado, entonces es sujeto a actualizaciones de precios
        else if (orderBy.getState().equals(OrderState.UNPAID)){
            // Obtener monto total (suma de prodcutos*quantity)*creation_quantity + extra
            totalPrice = orderBy.getCreations().stream()
                    .flatMap(c -> c.getCreation().getProducts().stream()
                            .map(product -> product.getProduct().getPrice()
                                    .multiply(BigDecimal.valueOf(product.getQuantity()))
                                    .multiply(BigDecimal.valueOf(c.getQuantity()))))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            // Agregar propina
            totalPrice = totalPrice.add(orderBy.getExtraAmount());
        }
        // Si el pedido ya fue pagado, o se esta pagando, entonces los precios ya fueron establecidos en OrderHasCreations
        else {
            totalPrice = orderBy.getCreations().stream()
                    .map(c -> c.getPrice().multiply(BigDecimal.valueOf(c.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            // Agregar propina
            totalPrice = totalPrice.add(orderBy.getExtraAmount());
        }

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
                .extraAmount(orderBy.getExtraAmount())
                .totalPrice(totalPrice)
                .notes(orderBy.getNotes())
                .dateCreated(orderBy.getDateCreated())
                .build();
    }
}
