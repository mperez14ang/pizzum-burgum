package uy.um.edu.pizzumburgum.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.request.*;
import uy.um.edu.pizzumburgum.dto.response.CartCheckoutResponse;
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
    public ResponseEntity<CartResponse> addToCart(HttpServletRequest httpRequest, @Valid @RequestBody AddToCartRequest request) {
        String clientEmail = authService.getUserEmail(httpRequest);
        log.info("POST /api/cart/v1/add - Cliente: {}", clientEmail);
        CartResponse response = cartService.addToCart(request, clientEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/add_creation")
    public ResponseEntity<CartResponse> addCreationToCart(HttpServletRequest httpRequest, @Valid @RequestBody OrderHasCreationsRequest request) {
        String clientEmail = authService.getUserEmail(httpRequest);
        log.info("POST /api/cart/v1/addCreationToCart: {}", clientEmail);
        CartResponse response = cartService.addCreationToCart(request, clientEmail);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    //GET /api/cart/v1/my: obtiene el carrito activo de un cliente

    @GetMapping("/my")
    public ResponseEntity<CartResponse> getCart(HttpServletRequest request) {
        String clientEmail = authService.getUserEmail(request);
        CartResponse response = cartService.getCart(clientEmail);
        return ResponseEntity.ok(response);
    }

    //PUT /api/cart/v1/items/{itemId}:Actualiza la cantidad de un item en el carrito
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            HttpServletRequest httpRequest,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        String clientEmail = authService.getUserEmail(httpRequest);
        log.info("PUT /api/cart/v1/items/{}", itemId);
        CartResponse response = cartService.updateCartItemQuantity(clientEmail, itemId, request);
        return ResponseEntity.ok(response);
    }

    //DELETE /api/cart/v1/items/{itemId}: elimina un item del carrito
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            HttpServletRequest httpRequest,
            @PathVariable Long itemId) {

        String clientEmail = authService.getUserEmail(httpRequest);
        log.info("DELETE /api/cart/v1/items/{}", itemId);
        CartResponse response = cartService.removeCartItem(clientEmail, itemId);
        return ResponseEntity.ok(response);
    }

    //DELETE /api/cart/v1/clear: vacía completamente el carrito
    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearCart(
            HttpServletRequest httpRequest
    ) {
        String clientEmail = authService.getUserEmail(httpRequest);
        log.info("DELETE /api/cart/v1/clear");
        cartService.clearCart(clientEmail);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Carrito vaciado exitosamente");

        return ResponseEntity.ok(response);
    }

    //POST /api/cart/v1/checkout: finaliza la compra: selecciona dirección, metodo de pago y confirma (UNPAID → IN_QUEUE)

    @PostMapping("/checkout")
    public ResponseEntity<CartCheckoutResponse> checkout(
            HttpServletRequest httpRequest,
            @Valid @RequestBody CheckoutRequest request) throws InterruptedException {

        String clientEmail = authService.getUserEmail(httpRequest);
        log.info("POST /api/cart/v1/checkout");
        CartCheckoutResponse response = cartService.checkout(clientEmail, request);
        return ResponseEntity.ok(response);
    }
}