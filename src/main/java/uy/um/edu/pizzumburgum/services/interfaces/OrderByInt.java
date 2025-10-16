package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.shared.OrderByDto;

import java.util.List;

public interface OrderByInt {
    OrderByDto createOder(OrderByDto orderByDto);

    OrderByDto getOrderById(Long id);

    List<OrderByDto> getOrders();

    OrderByDto updateOrder(Long id, OrderByDto orderByDto);

    ResponseEntity<String> deleteOrder(Long id);
}
