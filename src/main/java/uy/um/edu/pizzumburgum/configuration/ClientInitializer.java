package uy.um.edu.pizzumburgum.configuration;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import uy.um.edu.pizzumburgum.dto.request.AddressRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Admin;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.repository.AddressRepository;
import uy.um.edu.pizzumburgum.repository.AdminRepository;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.services.ClientService;

import java.time.LocalDate;
import java.util.*;

/**
 * Esto crea un cliente por defecto TODO: ELIMINAR PARA PRODUCCION
 * **/
@Component
public class ClientInitializer implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(ClientInitializer.class);

    private final PasswordEncoder passwordEncoder;
    private final ClientService clientService;
    private final ClientRepository clientRepository;

    public ClientInitializer(PasswordEncoder passwordEncoder, ClientService clientService, ClientRepository clientRepository) {
        this.clientService = clientService;
        this.passwordEncoder = passwordEncoder;
        this.clientRepository = clientRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (clientRepository.findById("prueba@prueba.com").isEmpty()){
            ClientCreateRequest client = ClientCreateRequest.builder()
                    .firstName("Pepe")
                    .lastName("Diaz")
                    .birthDate(LocalDate.of(1988, 2, 28))
                    .dni("80639721")
                    .email("prueba@prueba.com")
                    .password("prueba1234")
                    .addresses(Set.of(
                            AddressRequest.builder()
                                    .street("123 Main St")
                                    .city("Montevideo")
                                    .postalCode("11200")
                                    .build(),
                            AddressRequest.builder()
                                    .street("654 Main St")
                                    .city("Montevideo")
                                    .postalCode("99023")
                                    .build()
                    ))
                    .build();
            clientService.createClient(client);
            System.out.println("Cliente " + client.getEmail() + " created");
        }

    }
}
