package uy.um.edu.pizzumburgum.services;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
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

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Slf4j
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
    public TokenResponse verifyUser(HttpServletRequest request) {
        boolean verified = false;
        Date expirationDate = null;
        Date emmissionDate = null;
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null) {
            String userEmail = this.getUserEmail(request);

            if (userEmail != null && userRepository.findById(userEmail).isPresent()) {
                String token = this.getToken(request);
                log.info("Token: {}", token);
                if (!token.isEmpty()) {
                    verified = this.verifyToken(token);
                    expirationDate = this.getTokenExpirationDate(token);
                    emmissionDate = this.getTokenExpirationDate(token);
                }
                else{
                    verified = true;
                }
            }
        }



        return TokenResponse.builder()
                .verified(verified)
                .expirationDate(expirationDate)
                .emittedDate(emmissionDate)
                .build();
    }

    @Override
    public String getUserEmail(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader.startsWith("Bearer ")){
            String token = this.getToken(request);
            return this.getTokenUsername(token);
        }

        /** Esta autenticacion NO ES SEGURA, solo para PostMan **/
        if (authHeader.startsWith("Basic ")) {
            try {
                String base64Credentials = authHeader.substring("Basic ".length()).trim();
                byte[] decodedBytes = Base64.getDecoder().decode(base64Credentials);
                String decodedCredentials = new String(decodedBytes, StandardCharsets.UTF_8);

                // username:password
                String[] values = decodedCredentials.split(":", 2);

                // Devolver username
                return values[0];

            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid Basic authentication header");
            }
        }
        return null;
    }

    private boolean verifyToken(String jwtToken) {
        if (jwtToken == null || jwtToken.isEmpty()) {return false;}
        return !jwtService.isTokenExpired(jwtToken);
    }

    private Date getTokenExpirationDate(String jwtToken) {
        return jwtService.extractExpiration(jwtToken);
    }

    private Date getTokenEmissionDate(String jwtToken) {
        return jwtService.extractEmisionDate(jwtToken);
    }

    private String getTokenUsername(String jwtToken) {
        return jwtService.extractUsername(jwtToken);
    }

    private String getToken(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        if (authHeader.startsWith("Bearer ")){
            return request.getHeader("Authorization").substring(7);
        }
        return "";
    }
}
