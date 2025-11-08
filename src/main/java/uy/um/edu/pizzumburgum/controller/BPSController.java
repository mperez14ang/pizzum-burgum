package uy.um.edu.pizzumburgum.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uy.um.edu.pizzumburgum.dto.response.BPSUserStatisticsResponse;
import uy.um.edu.pizzumburgum.services.BPSService;

@RestController
@RequestMapping("/api/bps")
@RequiredArgsConstructor
public class BPSController {

    private final BPSService bpsService;

    /**
     * Obtiene estadísticas de usuarios del sistema
     * Ejemplo: GET /api/bps/users/statistics
     */
    @GetMapping("/users/statistics")
    public ResponseEntity<BPSUserStatisticsResponse> getUserStatistics() {
        BPSUserStatisticsResponse statistics = bpsService.getUserStatistics();
        return ResponseEntity.ok(statistics);
    }
}