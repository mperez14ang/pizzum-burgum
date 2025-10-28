package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.response.CartItemResponse;
import uy.um.edu.pizzumburgum.dto.response.CartResponse;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.CreationHasProducts;
import uy.um.edu.pizzumburgum.entities.CreationType;
import uy.um.edu.pizzumburgum.entities.OrderBy;
import uy.um.edu.pizzumburgum.entities.OrderHasCreations;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class CartMapper {

    public static CartResponse toCartResponse(OrderBy orderBy) {
        // Mapear items del carrito
        List<CartItemResponse> items = orderBy.getCreations().stream()
                .map(CartMapper::toCartItemResponse)
                .collect(Collectors.toList());

        // Calcular total
        float total = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(0f, Float::sum);

        // Contar items totales
        int totalItems = items.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        return CartResponse.builder()
                .orderId(orderBy.getId())
                .state(orderBy.getState().name())
                .clientEmail(orderBy.getClient().getEmail())
                .clientName(orderBy.getClient().getFirstName())
                .deliveryAddress(AddressMapper.toAddressResponse(orderBy.getAddress()))
                .items(items)
                .total(total)
                .totalItems(totalItems)
                .build();
    }

    private static CartItemResponse toCartItemResponse(OrderHasCreations orderHasCreations) {
        Set<ProductDto> ingredients = orderHasCreations.getCreation().getProducts().stream()
                .map(CreationHasProducts::getProduct)
                .map(ProductMapper::toProductDto)
                .collect(Collectors.toSet());

        String image = null;
        if (orderHasCreations.getCreation().getType() == CreationType.PIZZA){
            image = "assets/pizza.jpg";
        }
        else if (orderHasCreations.getCreation().getType() == CreationType.HAMBURGER){
            image = "assets/burger.jpg";
        }

        float unitPrice = orderHasCreations.getCreation().getPrice();
        float subtotal = unitPrice * orderHasCreations.getQuantity();

        return CartItemResponse.builder()
                .itemId(orderHasCreations.getId())
                .creationId(orderHasCreations.getCreation().getId())
                .creationName(orderHasCreations.getCreation().getName())
                .creationType(orderHasCreations.getCreation().getType().name())
                .ingredients(ingredients)
                .unitPrice(unitPrice)
                .quantity(orderHasCreations.getQuantity())
                .subtotal(subtotal)
                .image(image)
                .build();
    }
}