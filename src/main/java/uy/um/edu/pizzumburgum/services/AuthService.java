package uy.um.edu.pizzumburgum.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.LoginRequest;
import uy.um.edu.pizzumburgum.dto.request.TokenRequest;
import uy.um.edu.pizzumburgum.dto.response.AuthResponse;
import uy.um.edu.pizzumburgum.dto.response.ClientResponse;
import uy.um.edu.pizzumburgum.entities.User;
import uy.um.edu.pizzumburgum.repository.UserRepository;
import uy.um.edu.pizzumburgum.services.interfaces.AuthServiceInt;

import java.util.Date;

@Service
public class AuthService implements AuthServiceInt {
    private final UserRepository userRepository;

    private final ClientService clientService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, ClientService clientService, JwtService jwtService) {
        this.userRepository = userRepository;
        this.clientService = clientService;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(ClientCreateRequest request) {
        // Crea Client con ClientService
        ClientResponse clientResponse = clientService.createClient(request);

        String jwtToken = jwtService.generateToken(clientResponse);
        return new AuthResponse(jwtToken, clientResponse.getEmail(), clientResponse.getFirstName(), clientResponse.getUserType() , "Usuario " + clientResponse.getEmail() + " registrado correctamente");

    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findById(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email o contraseña incorrecta");
        }

        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken, user.getEmail(), user.getFirstName(), user.getUserType(), "Usuario " + user.getEmail() + " logueado correctamente");
    }

    @Override
    public boolean verifyToken(TokenRequest request) {
        String jwtToken = request.getToken();
        if (jwtToken == null || jwtToken.isEmpty()) {return false;}
        return !jwtService.isTokenExpired(jwtToken);
    }

    @Override
    public Date getTokenExpirationDate(TokenRequest request) {
        String jwtToken = request.getToken();
        return jwtService.extractExpiration(jwtToken);
    }

    @Override
    public Date getTokenEmissionDate(TokenRequest request) {
        String jwtToken = request.getToken();
        return jwtService.extractEmisionDate(jwtToken);
    }
}
