package uy.um.edu.pizzumburgum.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.request.PaymentRequest;
import uy.um.edu.pizzumburgum.services.AuthService;
import uy.um.edu.pizzumburgum.services.PaymentService;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final AuthService authService;

    public PaymentController(PaymentService paymentService, AuthService authService) {
        this.paymentService = paymentService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPayment(
            HttpServletRequest request,
            @RequestBody PaymentRequest paymentRequest
    ) {

        String clientEmail = authService.getUserEmail(request);
        Map<String, Object> response = paymentService.createPaymentIntent(
                clientEmail,
                paymentRequest.getCardId(),
                paymentRequest.getAmount(),
                paymentRequest.getCurrency(),
                paymentRequest.getDescription()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{paymentIntentId}")
    public ResponseEntity<Map<String, Object>> getPaymentStatus(
            @PathVariable String paymentIntentId
    ) {
        Map<String, Object> response = paymentService.getPaymentStatus(paymentIntentId);
        return ResponseEntity.ok(response);
    }

}