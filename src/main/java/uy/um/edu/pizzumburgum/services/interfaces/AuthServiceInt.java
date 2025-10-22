package uy.um.edu.pizzumburgum.services.interfaces;

import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.LoginRequest;
import uy.um.edu.pizzumburgum.dto.request.TokenRequest;
import uy.um.edu.pizzumburgum.dto.response.AuthResponse;

import java.util.Date;

public interface AuthServiceInt {
    AuthResponse register(ClientCreateRequest request);

    AuthResponse login(LoginRequest request);

    boolean verifyToken(TokenRequest request);

    Date getTokenEmissionDate(TokenRequest request);

    Date getTokenExpirationDate(TokenRequest request);

}
