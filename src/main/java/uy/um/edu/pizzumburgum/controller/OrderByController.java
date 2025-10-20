package uy.um.edu.pizzumburgum.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.request.OrderByRequest;
import uy.um.edu.pizzumburgum.dto.response.OrderByResponse;
import uy.um.edu.pizzumburgum.entities.OrderState;
import uy.um.edu.pizzumburgum.services.OrderByService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order/v1")
public class OrderByController {
    OrderByService orderByService;

    public OrderByController(OrderByService orderByService) {
        this.orderByService = orderByService;
    }

    @PostMapping
    public OrderByResponse createOrder(@RequestBody OrderByRequest orderByRequest) {
        return orderByService.createOder(orderByRequest);
    }

    @GetMapping("{id}")
    public OrderByResponse getOrderById(@PathVariable Long id) {
        return orderByService.getOrderById(id);
    }

    @GetMapping
    public List<OrderByResponse> getOrders() {
        return orderByService.getOrders();
    }

    @GetMapping("state/{state}")
    public List<OrderByResponse> getOrdersByState(@PathVariable OrderState state) {
        return orderByService.getOrdersByState(state);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Map<String, Object>> deleteOrder(@PathVariable Long id) {
        return orderByService.deleteOrder(id);
    }
}
