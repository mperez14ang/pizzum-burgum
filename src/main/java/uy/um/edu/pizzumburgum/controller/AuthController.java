package uy.um.edu.pizzumburgum.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.ChangePasswordRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.LoginRequest;
import uy.um.edu.pizzumburgum.dto.response.AuthResponse;
import uy.um.edu.pizzumburgum.dto.response.TokenResponse;
import uy.um.edu.pizzumburgum.services.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/v1")
public class AuthController {
    private final AuthService authService;
    Logger log = LoggerFactory.getLogger(FavoritesController.class);

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody ClientCreateRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public TokenResponse verifyUser(HttpServletRequest request) {
        return authService.verifyUser(request);
    }

    @PostMapping("/password")
    public ResponseEntity<Map<String, Object>> changeUserPassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        return authService.updateUserPassword(changePasswordRequest);
    }

}
