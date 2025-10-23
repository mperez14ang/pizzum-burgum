package uy.um.edu.pizzumburgum.services;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.LoginRequest;
import uy.um.edu.pizzumburgum.dto.response.AuthResponse;
import uy.um.edu.pizzumburgum.dto.response.ClientResponse;
import uy.um.edu.pizzumburgum.dto.response.TokenResponse;
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
        return new AuthResponse(jwtToken, clientResponse.getEmail(), clientResponse.getUserType() , "Usuario " + clientResponse.getEmail() + " registrado correctamente");

    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findById(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email o contraseña incorrecta");
        }

        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken, user.getEmail(), user.getUserType(), "Usuario " + user.getEmail() + " logueado correctamente");
    }

    @Override
    public TokenResponse verifyToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        boolean verified = false;
        Date expirationDate = null;
        Date emmissionDate = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = this.getToken(request);
            verified = this.verifyToken(token);
            expirationDate = this.getTokenExpirationDate(token);
            emmissionDate = this.getTokenEmissionDate(token);
        }

        return TokenResponse.builder()
                .verified(verified)
                .expirationDate(expirationDate)
                .emittedDate(emmissionDate)
                .build();
    }

    @Override
    public boolean verifyToken(String jwtToken) {
        if (jwtToken == null || jwtToken.isEmpty()) {return false;}
        return !jwtService.isTokenExpired(jwtToken);
    }

    @Override
    public Date getTokenExpirationDate(String jwtToken) {
        return jwtService.extractExpiration(jwtToken);
    }

    @Override
    public Date getTokenEmissionDate(String jwtToken) {
        return jwtService.extractEmisionDate(jwtToken);
    }

    @Override
    public String getTokenUsername(String jwtToken) {
        return jwtService.extractUsername(jwtToken);
    }

    public String getToken(HttpServletRequest request){
        return request.getHeader("Authorization").substring(7);
    }
}
