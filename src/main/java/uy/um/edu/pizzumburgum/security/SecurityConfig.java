package uy.um.edu.pizzumburgum.security;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import uy.um.edu.pizzumburgum.entities.Admin;

import java.time.LocalDate;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity.authorizeHttpRequests(auth -> auth
                        // Endpoints para todos
                        .requestMatchers("/api/public/**").permitAll()

                        // Endpoints para Admin
                        .requestMatchers("/api/admin/**").hasRole("Admin")

                        // Endpoints para Client o Admin TODO: Esto capaz lo cambiamos despues y que sea solo Client
                        .requestMatchers("/api/client/**").hasAnyRole("Client", "Admin")

                        // Endpoints Admin o Client
                        .requestMatchers("/api/common/**").hasAnyRole("Admin", "Client")

                        // Cualquer otro lo denega
                        .anyRequest().authenticated()
                )
                .httpBasic(http -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .build();
    }

    /**
     * Crea un Admin por defecto
     * **/
    @Bean
    public UserDetailsService userDetailsService() {
        Dotenv dotenv = Dotenv.load();
        Admin admin = Admin.builder()
                .email("admin@admin.com")
                .username(dotenv.get("ADMIN_USERNAME"))
                .lastName(".")
                .birthDate(LocalDate.now())
                .dni("00000000")
                .password(passwordEncoder().encode(dotenv.get("ADMIN_PASSWORD")))
                .createdBy(null)
                .build();


        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
