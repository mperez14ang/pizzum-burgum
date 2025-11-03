package uy.um.edu.pizzumburgum.services.interfaces;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.ChangePasswordRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.LoginRequest;
import uy.um.edu.pizzumburgum.dto.response.AuthResponse;
import uy.um.edu.pizzumburgum.dto.response.TokenResponse;

import java.util.Map;

public interface AuthServiceInt {
    AuthResponse register(ClientCreateRequest request);

    AuthResponse login(LoginRequest request);

    TokenResponse verifyUser(HttpServletRequest request);

    String getUserEmail(HttpServletRequest request);

    @Transactional
    ResponseEntity<Map<String, Object>> updateUserPassword(ChangePasswordRequest changePasswordRequest);
}
