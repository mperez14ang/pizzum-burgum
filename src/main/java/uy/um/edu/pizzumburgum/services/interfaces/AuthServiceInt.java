package uy.um.edu.pizzumburgum.services.interfaces;

import jakarta.servlet.http.HttpServletRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.LoginRequest;
import uy.um.edu.pizzumburgum.dto.response.AuthResponse;
import uy.um.edu.pizzumburgum.dto.response.TokenResponse;

public interface AuthServiceInt {
    AuthResponse register(ClientCreateRequest request);

    AuthResponse login(LoginRequest request);

    TokenResponse verifyUser(HttpServletRequest request);

    String getUserEmail(HttpServletRequest request);
}
