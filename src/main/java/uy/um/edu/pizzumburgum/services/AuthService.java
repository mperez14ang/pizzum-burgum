package uy.um.edu.pizzumburgum.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.response.AuthResponse;
import uy.um.edu.pizzumburgum.dto.response.ClientDtoResponse;
import uy.um.edu.pizzumburgum.dto.shared.LoginDto;
import uy.um.edu.pizzumburgum.entities.User;
import uy.um.edu.pizzumburgum.repository.UserRepository;
import uy.um.edu.pizzumburgum.services.interfaces.AuthServiceInt;

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
        ClientDtoResponse clientDtoResponse = clientService.createClient(request);

        String jwtToken = jwtService.generateToken(clientDtoResponse);
        return new AuthResponse(jwtToken, clientDtoResponse.getEmail(), clientDtoResponse.getUserType() , "Usuario " + clientDtoResponse.getEmail() + " registrado correctamente");

    }

    @Override
    public AuthResponse login(LoginDto request) {
        User user = userRepository.findById(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email o contraseña incorrecta");
        }

        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken, user.getEmail(), user.getUserType(), "Usuario " + user.getEmail() + " logueado correctamente");
    }
}
