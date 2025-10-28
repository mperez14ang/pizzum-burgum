package uy.um.edu.pizzumburgum.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.request.AddToCartRequest;
import uy.um.edu.pizzumburgum.dto.request.CheckoutRequest;
import uy.um.edu.pizzumburgum.dto.request.UpdateCartItemRequest;
import uy.um.edu.pizzumburgum.dto.response.CartResponse;
import uy.um.edu.pizzumburgum.dto.response.OrderByResponse;
import uy.um.edu.pizzumburgum.services.AuthService;
import uy.um.edu.pizzumburgum.services.CartService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart/v1")
@Slf4j
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private final AuthService authService;

    public CartController(AuthService authService) {
        this.authService = authService;
    }

    //POST /api/cart/v1/add: Agrega una creación personalizada al carrito

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody AddToCartRequest request) {
        log.info("POST /api/cart/v1/add - Cliente: {}", request.getClientEmail());
        CartResponse response = cartService.addToCart(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //GET /api/cart/v1/my: obtiene el carrito activo de un cliente

    @GetMapping("/my")
    public ResponseEntity<CartResponse> getActiveCart(HttpServletRequest request) {
        String clientEmail = authService.getUserEmail(request);
        CartResponse response = cartService.getActiveCart(clientEmail);
        return ResponseEntity.ok(response);
    }

    //GET /api/cart/v1/{orderId}:Obtiene un carrito por su ID
    @GetMapping("/{orderId}")
    public ResponseEntity<CartResponse> getCartById(@PathVariable Long orderId) {
        log.info("GET /api/cart/v1/{}", orderId);
        CartResponse response = cartService.getCartById(orderId);
        return ResponseEntity.ok(response);
    }

    //PUT /api/cart/v1/{orderId}/items/{itemId}:Actualiza la cantidad de un item en el carrito
    @PutMapping("/{orderId}/items/{itemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long orderId,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        log.info("PUT /api/cart/v1/{}/items/{}", orderId, itemId);
        CartResponse response = cartService.updateCartItemQuantity(orderId, itemId, request);
        return ResponseEntity.ok(response);
    }

    //DELETE /api/cart/v1/{orderId}/items/{itemId}: elimina un item del carrito
    @DeleteMapping("/{orderId}/items/{itemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            @PathVariable Long orderId,
            @PathVariable Long itemId) {

        log.info("DELETE /api/cart/v1/{}/items/{}", orderId, itemId);
        CartResponse response = cartService.removeCartItem(orderId, itemId);
        return ResponseEntity.ok(response);
    }

    //DELETE /api/cart/v1/{orderId}/clear: vacía completamente el carrito
    @DeleteMapping("/{orderId}/clear")
    public ResponseEntity<Map<String, String>> clearCart(@PathVariable Long orderId) {
        log.info("DELETE /api/cart/v1/{}/clear", orderId);
        cartService.clearCart(orderId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Carrito vaciado exitosamente");

        return ResponseEntity.ok(response);
    }

    //POST /api/cart/v1/{orderId}/checkout: finaliza la compra: selecciona dirección, método de pago y confirma (UNPAID → IN_QUEUE)

    @PostMapping("/{orderId}/checkout")
    public ResponseEntity<OrderByResponse> checkout(
            @PathVariable Long orderId,
            @Valid @RequestBody CheckoutRequest request) {

        log.info("POST /api/cart/v1/{}/checkout", orderId);
        OrderByResponse response = cartService.checkout(orderId, request);
        return ResponseEntity.ok(response);
    }
}