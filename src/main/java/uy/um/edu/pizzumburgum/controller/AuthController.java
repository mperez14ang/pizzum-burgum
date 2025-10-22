package uy.um.edu.pizzumburgum.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.LoginRequest;
import uy.um.edu.pizzumburgum.dto.request.TokenRequest;
import uy.um.edu.pizzumburgum.dto.response.AuthResponse;
import uy.um.edu.pizzumburgum.dto.response.TokenResponse;
import uy.um.edu.pizzumburgum.services.AuthService;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/v1")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody ClientCreateRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, e.getMessage()
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, e.getMessage()
            );
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<TokenResponse> verifyToken(@RequestBody TokenRequest token) {
        boolean verified = authService.verifyToken(token);
        TokenResponse tokenResponse = TokenResponse.builder()
                .verified(verified)
                .expirationDate(authService.getTokenExpirationDate(token))
                .emittedDate(authService.getTokenEmissionDate(token))
                .build();
        return ResponseEntity.ok(tokenResponse);
    }
}
