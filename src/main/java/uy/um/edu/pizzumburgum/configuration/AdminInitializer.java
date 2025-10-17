package uy.um.edu.pizzumburgum.configuration;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import uy.um.edu.pizzumburgum.entities.Admin;
import uy.um.edu.pizzumburgum.repository.AdminRepository;

import java.time.LocalDate;

import static uy.um.edu.pizzumburgum.entities.Admin.*;

/**
 * Esto crea un admin por defecto, y lo agrega a la base de datos (si no existe claro)
 * **/
@Component
public class AdminInitializer implements CommandLineRunner {
    @Autowired
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        Dotenv dotenv = Dotenv.load();
        String adminEmail = "admin@admin.com";
        if (adminRepository.findById(adminEmail).isEmpty()) {
            Admin admin = builder()
                    .email(adminEmail)
                    .username(dotenv.get("ADMIN_USERNAME"))
                    .lastName("admin")
                    .birthDate(LocalDate.of(1950, 7, 16))
                    .dni("00000000")
                    .password(passwordEncoder.encode(dotenv.get("ADMIN_PASSWORD")))
                    .build();
            adminRepository.save(admin);
            System.out.println("Se creo un admin por defecto");
            System.out.println("Nombre del admin: " + admin.getUsername() + " " + admin.getLastName());
        }
        else  {
            System.out.println("Admin con correo " + adminEmail +" ya existe!");
        }
    }
}
