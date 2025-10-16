package uy.um.edu.pizzumburgum.services;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.shared.OrderByDto;
import uy.um.edu.pizzumburgum.services.interfaces.OrderByInt;

import java.util.List;

public class OrderByService implements OrderByInt {
    @Override
    public OrderByDto createOder(OrderByDto orderByDto) {
        return null;
    }

    @Override
    public OrderByDto getOrderById(Long id) {
        return null;
    }

    @Override
    public List<OrderByDto> getOrders() {
        return List.of();
    }

    @Override
    public OrderByDto updateOrder(Long id, OrderByDto orderByDto) {
        return null;
    }

    @Override
    public ResponseEntity<String> deleteOrder(Long id) {
        return null;
    }
}
