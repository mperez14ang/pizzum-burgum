package uy.um.edu.pizzumburgum.services;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.response.ClientResponse;
import uy.um.edu.pizzumburgum.entities.User;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    private final String secretKey;

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;

    public JwtService(){
        Dotenv dotenv = Dotenv.load();
        secretKey = dotenv.get("SECRET_KEY");
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        } catch (ExpiredJwtException e) {
            logger.error("JWT token expiró: {}", e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            logger.error("JWT token mal formado: {}", e.getMessage());
            throw e;
        } catch (SignatureException e) {
            logger.error("JWT firma inválida: {}", e.getMessage());
            throw e;
        } catch (JwtException e) {
            logger.error("JWT token inválido: {}", e.getMessage());
            throw e;
        }
    }

    public String generateToken(User user) {
        return generateToken(new HashMap<>(), user.getEmail());
    }

    public String generateToken(ClientResponse clientResponse) {
        return generateToken(new HashMap<>(), clientResponse.getEmail());
    }

    public String generateToken(Map<String, Object> extraClaims, String id) {
        return buildToken(extraClaims, id, jwtExpiration);
    }

    public long getExpirationTime() {
        return jwtExpiration;
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            String id,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(id)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            logger.warn("Token expirado durante validacion");
            return false;
        } catch (JwtException e) {
            logger.warn("Token inválido durante validación: {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Date expiration = extractExpiration(token);
            if (expiration == null) return true;
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (Exception e) {
            logger.error("Error al verificar expiración del token: {}", e.getMessage());
            return true;
        }
    }

    public Date extractExpiration(String token) {
        try {
            return extractClaim(token, Claims::getExpiration);
        } catch (ExpiredJwtException e) {
            return e.getClaims().getExpiration();
        } catch (Exception e) {
            logger.error("Error al extraer fecha de expiración: {}", e.getMessage());
            return null;
        }
    }

    public Date extractEmisionDate(String token) {
        try {
            return extractClaim(token, Claims::getIssuedAt);
        } catch (ExpiredJwtException e) {
            return e.getClaims().getIssuedAt();
        } catch (Exception e) {
            logger.error("Error al extraer fecha de emisión: {}", e.getMessage());
            return null;
        }
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts
                    .parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            logger.error("Token expiró el: {}", e.getClaims().getExpiration());
            throw e;
        } catch (MalformedJwtException e) {
            logger.error("Token mal formado");
            throw e;
        } catch (SignatureException e) {
            logger.error("Firma del token inválida");
            throw e;
        } catch (JwtException e) {
            logger.error("Error procesando JWT: {}", e.getMessage());
            throw e;
        }
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
