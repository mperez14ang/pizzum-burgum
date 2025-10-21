package uy.um.edu.pizzumburgum.configuration;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import uy.um.edu.pizzumburgum.entities.Admin;
import uy.um.edu.pizzumburgum.repository.AdminRepository;

import java.time.LocalDate;

/**
 * Esto crea un admin por defecto, y lo agrega a la base de datos (si no existe claro)
 * **/
@Component
public class AdminInitializer implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

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
            Admin admin = Admin.builder()
                    .email(adminEmail)
                    .firstName(dotenv.get("ADMIN_USERNAME"))
                    .lastName("admin")
                    .birthDate(LocalDate.of(1950, 7, 16))
                    .dni("00000000")
                    .password(passwordEncoder.encode(dotenv.get("ADMIN_PASSWORD")))
                    .build();
            adminRepository.save(admin);
            logger.debug("Se creo un admin por defecto");
            logger.debug("Nombre del admin: {} {}", admin.getFirstName(), admin.getLastName());
        }
        else  {
            logger.debug("Admin con correo {} ya existe!", adminEmail);
        }
    }
}
