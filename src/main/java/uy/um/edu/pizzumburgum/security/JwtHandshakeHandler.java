package uy.um.edu.pizzumburgum.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import uy.um.edu.pizzumburgum.services.JwtService;

import java.util.List;
import java.util.Map;

public class JwtHandshakeHandler extends DefaultHandshakeHandler {
    private static final Logger logger = LoggerFactory.getLogger(JwtHandshakeHandler.class);

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtHandshakeHandler(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    protected boolean determineUser(ServerHttpRequest request, ServerHttpResponse response,
                                    WebSocketHandler wsHandler, Map<String, Object> attributes) {

        List<String> authHeaders = request.getHeaders().get("Authorization");
        if (authHeaders == null || authHeaders.isEmpty()) {
            logger.warn("❌ No Authorization header found in WebSocket handshake");
            return true; // permitir la conexión, pero sin usuario autenticado
        }

        String token = authHeaders.get(0).replace("Bearer ", "");
        try {
            String username = jwtService.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(token, userDetails)) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.info("✅ WebSocket autenticado: {}", username);
            } else {
                logger.warn("⚠️ Token inválido para WebSocket");
            }
        } catch (Exception e) {
            logger.error("❌ Error verificando JWT en WebSocket", e);
        }

        return true;
    }
}
