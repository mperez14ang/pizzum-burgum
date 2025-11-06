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

                        // Public endpoints
                        .requestMatchers("/api/public/**").permitAll()

                        .requestMatchers("/assets/**").permitAll()

                        // Products - READ ONLY public, WRITE requires ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.PATCH, "/api/products/**").hasRole(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole(ADMIN)

                        // ============ ADMIN ONLY ============
                        .requestMatchers("/api/admin/**").hasRole(ADMIN)

                        // ============ CLIENT + ADMIN ============
                        // User
                        .requestMatchers("/api/v1/user/**").hasAnyRole(CLIENT, ADMIN)

                        // Client
                        .requestMatchers("/api/favorites/**").hasRole(CLIENT)
                        .requestMatchers("/api/payments/**").hasRole(CLIENT)

                        // Admin
                        .requestMatchers("/api/client/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers("/api/order/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers("/api/cart/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers("/api/card/**").hasAnyRole(CLIENT, ADMIN)
                        .requestMatchers("/api/creation/**").hasAnyRole(CLIENT, ADMIN)

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
                "http://127.0.0.1:*"
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