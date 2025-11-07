package uy.um.edu.pizzumburgum.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.response.DGIOrderResponse;
import uy.um.edu.pizzumburgum.services.DGIService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dgi")
@RequiredArgsConstructor
public class DGIController {

    private final DGIService dgiService;

    /**
     * Obtiene todas las ordenes de un día específico
     * Ejemplo: GET /api/dgi/orders?date=2025-01-15
     */
    @GetMapping("/orders")
    public ResponseEntity<List<DGIOrderResponse>> getOrdersByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<DGIOrderResponse> orders = dgiService.getOrdersByDate(date);
        return ResponseEntity.ok(orders);
    }

    /**
     * Obtiene todas las ordenes en un rango de fechas
     * Ejemplo: GET /api/dgi/orders/range?startDate=2025-01-01&endDate=2025-01-31
     */
    @GetMapping("/orders/range")
    public ResponseEntity<List<DGIOrderResponse>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DGIOrderResponse> orders = dgiService.getOrdersByDateRange(startDate, endDate);
        return ResponseEntity.ok(orders);
    }
}
