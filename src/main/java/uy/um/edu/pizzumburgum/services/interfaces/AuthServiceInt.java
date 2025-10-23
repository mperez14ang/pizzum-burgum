package uy.um.edu.pizzumburgum.services.interfaces;

import jakarta.servlet.http.HttpServletRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.LoginRequest;
import uy.um.edu.pizzumburgum.dto.response.AuthResponse;
import uy.um.edu.pizzumburgum.dto.response.TokenResponse;

import java.util.Date;

public interface AuthServiceInt {
    AuthResponse register(ClientCreateRequest request);

    AuthResponse login(LoginRequest request);

    TokenResponse verifyToken(HttpServletRequest request);

    boolean verifyToken(String jwtToken);

    Date getTokenEmissionDate(String jwtToken);

    Date getTokenExpirationDate(String jwtToken);

    String getTokenUsername(String jwtToken);
}
