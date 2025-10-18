package uy.um.edu.pizzumburgum.services.interfaces;

import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.response.AuthResponse;
import uy.um.edu.pizzumburgum.dto.shared.LoginDto;

public interface AuthServiceInt {
    AuthResponse register(ClientCreateRequest request);

    AuthResponse login(LoginDto request);
}
