package uy.um.edu.pizzumburgum.services;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.ChangePasswordRequest;
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
import java.util.HashMap;
import java.util.Map;

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
        ClientResponse clientResponse = clientService.createClient(request);
        String jwtToken = jwtService.generateToken(clientResponse);
        return AuthResponse.builder()
                .token(jwtToken)
                .email(clientResponse.getEmail())
                .firstName(clientResponse.getFirstName())
                .lastName(clientResponse.getLastName())
                .role(clientResponse.getUserType())
                .message("Usuario " + clientResponse.getEmail() + " registrado correctamente")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findById(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email o contraseña incorrecta"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email o contraseña incorrecta");
        }

        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getUserType())
                .message("Usuario " + user.getEmail() + " logueado correctamente")
                .build();
    }

    @Override
    public TokenResponse verifyUser(HttpServletRequest request) {
        boolean verified = false;
        Date expirationDate = null;
        Date emissionDate = null;
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null) {
            try {
                String token = this.getToken(request);
                log.info("Token: {}", token);

                if (!token.isEmpty()) {
                    String userEmail = this.getTokenUsername(token);

                    if (userEmail != null && userRepository.findById(userEmail).isPresent()) {
                        verified = this.verifyToken(token);
                        expirationDate = this.getTokenExpirationDate(token);
                        emissionDate = this.getTokenEmissionDate(token);
                    }
                } else {
                    verified = true;
                }
            } catch (ExpiredJwtException e) {
                log.warn("Token expirado en verifyUser: {}", e.getMessage());
                verified = false;
                expirationDate = e.getClaims().getExpiration();
                emissionDate = e.getClaims().getIssuedAt();
            } catch (JwtException e) {
                log.error("Token inválido en verifyUser: {}", e.getMessage());
                verified = false;
            } catch (Exception e) {
                log.error("Error inesperado en verifyUser: {}", e.getMessage());
                verified = false;
            }
        }

        return TokenResponse.builder()
                .verified(verified)
                .expirationDate(expirationDate)
                .emittedDate(emissionDate)
                .build();
    }

    @Override
    public String getUserEmail(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader.startsWith("Bearer ")) {
            try {
                String token = this.getToken(request);
                return this.getTokenUsername(token);
            } catch (ExpiredJwtException e) {
                log.warn("Intentando extraer email de token expirado");
                return e.getClaims().getSubject();
            } catch (JwtException e) {
                log.error("Error al extraer email del token: {}", e.getMessage());
                return null;
            }
        }

        /** Esta autenticacion NO ES SEGURA, solo para PostMan **/
        if (authHeader.startsWith("Basic ")) {
            try {
                String base64Credentials = authHeader.substring("Basic ".length()).trim();
                byte[] decodedBytes = Base64.getDecoder().decode(base64Credentials);
                String decodedCredentials = new String(decodedBytes, StandardCharsets.UTF_8);

                String[] values = decodedCredentials.split(":", 2);
                return values[0];

            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid Basic authentication header");
            }
        }
        return null;
    }

    @Transactional
    @Override
    public ResponseEntity<Map<String, Object>> updateUserPassword(ChangePasswordRequest changePasswordRequest) {
        String email = changePasswordRequest.getEmail();
        log.info(changePasswordRequest.toString());
        User user = userRepository.findById(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        String oldPassword = changePasswordRequest.getOldPassword();

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contraseña incorrecta");
        }

        if (!changePasswordRequest.getPassword().equals(changePasswordRequest.getPasswordConfirmation())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Las contraseñas no coinciden");
        }

        if (changePasswordRequest.getPassword().equals(oldPassword)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La nueva contraseña no debe coincidir con la antigua");
        }

        user.setPassword(passwordEncoder.encode(changePasswordRequest.getPassword()));
        userRepository.save(user);

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Contraseña actualizada");
        return new ResponseEntity<>(body, HttpStatus.OK);
    }

    private boolean verifyToken(String jwtToken) {
        if (jwtToken == null || jwtToken.isEmpty()) {
            return false;
        }
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

    private String getToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return "";
    }
}
