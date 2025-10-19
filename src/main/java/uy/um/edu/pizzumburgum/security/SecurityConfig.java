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
            HttpSecurity httpSecurity, AuthenticationProvider authenticationProvider,
            JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        return httpSecurity.authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login").permitAll()

                        .requestMatchers("/api/register").permitAll()

                        // Endpoints para todos
                        .requestMatchers("/api/public/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers("/api/products/**").hasRole(ADMIN)

                        // Admin endpoints
                        .requestMatchers("/api/admin/**").hasRole(ADMIN)

                        // Client endpoints
                        .requestMatchers("/api/client/**").hasAnyRole(CLIENT, ADMIN)

                        // Users endpoints
                        .requestMatchers("/api/users/**").hasAnyRole(CLIENT, ADMIN)

                        // Deny any other request
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults()) // TODO Basic Auth, esto hay que sacarlo para produccion porque lo ideal es dejar solo tokens
                .formLogin(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
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
        configuration.setAllowedOrigins(List.of("http://localhost:3001"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowCredentials(true);
        configuration.addAllowedHeader("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}