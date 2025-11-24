package uy.um.edu.pizzumburgum.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import uy.um.edu.pizzumburgum.services.DatabaseUserDetailsService;

import java.util.List;

import static uy.um.edu.pizzumburgum.entities.UserType.ADMIN;
import static uy.um.edu.pizzumburgum.entities.UserType.CLIENT;

/** <a href="https://www.kindsonthegenius.com/how-to-authenticate-from-react-to-spring-boot/">...</a> **/
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity httpSecurity,
            AuthenticationProvider authenticationProvider,
            JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {

        return httpSecurity
                .authorizeHttpRequests(auth -> auth
                        // OPTIONS requests (CORS preflight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ============ PUBLIC ENDPOINTS ============
                        // Authentication
                        .requestMatchers("/api/auth/**").permitAll()

                        // Permitir acceso completo a archivos estáticos
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/favicon.ico",
                                "/vite.svg",
                                "/assets/**"
                        ).permitAll()

                        // DGI and BPS
                        .requestMatchers("/api/dgi/**").permitAll()
                        .requestMatchers("/api/bps/**").permitAll()

                        // ============ ONLY LOGGED USERS ============
                        // Products - READ ONLY public, WRITE requires ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.PATCH, "/api/products/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole(ADMIN)

                        // Orders
                        .requestMatchers(HttpMethod.GET, "/api/order/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers(HttpMethod.POST, "/api/order/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/order/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.PATCH, "/api/order/v1/cancel/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers(HttpMethod.PATCH, "/api/order/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/order/**").hasRole(ADMIN)

                        // Creations
                        .requestMatchers(HttpMethod.GET, "/api/creation/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers(HttpMethod.POST, "/api/creation/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/creation/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.PATCH, "/api/creation/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/creation/**").hasRole(ADMIN)

                        // Client
                        .requestMatchers(HttpMethod.GET, "/api/client/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers(HttpMethod.POST, "/api/client/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/client/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.PATCH, "/api/client/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/client/**").hasRole(ADMIN)

                        // Payments
                        .requestMatchers(HttpMethod.POST, "/api/payments/**").hasAnyRole(ADMIN)
                        .requestMatchers(HttpMethod.GET, "/api/payments/**").hasRole(ADMIN)

                        .requestMatchers("/api/favorites/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers("/api/cart/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers("/api/card/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers("/api/v1/user/**").hasAnyRole(CLIENT, ADMIN)

                        .requestMatchers("/api/admin/**").hasRole(ADMIN)

                        // Web sockets
                        .requestMatchers("/ws/**").permitAll()

                        .anyRequest().authenticated()
                )
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .httpBasic(Customizer.withDefaults())
                .formLogin(AbstractHttpConfigurer::disable)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(DatabaseUserDetailsService databaseUserDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(databaseUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    /** Permitir acceso desde React **/
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://pizzumnburgum.duckdns.org"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.addAllowedHeader("*");
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}