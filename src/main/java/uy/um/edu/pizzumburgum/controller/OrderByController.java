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
        return orderByService.createOrder(orderByRequest);
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

    @PutMapping("{id}")
    public OrderByResponse updateOrder(@PathVariable Long id, @RequestBody OrderByRequest orderByDto) {
        return orderByService.updateOrder(id, orderByDto);
    }

    @PatchMapping("{id}/state")
    public ResponseEntity<OrderByResponse> updateOrderState(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String stateStr = body.get("state");
        if (stateStr == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            OrderState state = OrderState.valueOf(stateStr);
            return ResponseEntity.ok(orderByService.updateOrderState(id, state));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/states")
    public ResponseEntity<List<String>> getOrderStates() {
        return ResponseEntity.ok(
                java.util.Arrays.stream(OrderState.values())
                        .map(Enum::name)
                        .toList()
        );
    }
}
