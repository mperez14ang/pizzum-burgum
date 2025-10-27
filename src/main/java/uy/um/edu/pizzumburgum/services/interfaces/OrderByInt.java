package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.OrderByRequest;
import uy.um.edu.pizzumburgum.dto.response.OrderByResponse;
import uy.um.edu.pizzumburgum.entities.OrderState;

import java.util.List;
import java.util.Map;

public interface OrderByInt {
    OrderByResponse createOrder(OrderByRequest orderByDto);

    OrderByResponse getOrderById(Long id);

    List<OrderByResponse> getOrders();

    List<OrderByResponse> getOrdersByState(OrderState state);

    OrderByResponse updateOrder(Long id, OrderByRequest orderByDto);

    ResponseEntity<Map<String, Object>> deleteOrder(Long id);
}
