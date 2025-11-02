package uy.um.edu.pizzumburgum.services;

import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.param.CustomerCreateParams;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.controller.CreationController;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.ClientResponse;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.Favorites;
import uy.um.edu.pizzumburgum.mapper.AddressMapper;
import uy.um.edu.pizzumburgum.mapper.ClientMapper;
import uy.um.edu.pizzumburgum.mapper.FavoritesMapper;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.repository.CreationRepository;
import uy.um.edu.pizzumburgum.services.interfaces.ClientServiceInt;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService implements ClientServiceInt {

    private final ClientRepository clientRepository;

    private final CreationRepository creationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public ClientResponse createClient(ClientCreateRequest clientCreateRequest) {
        // Verificar que el cliente no existe
        if (clientRepository.existsById(clientCreateRequest.getEmail())){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Cliente con id " + clientCreateRequest.getEmail() + " ya existe"
            );
        }

        Client client = ClientMapper.toClient(clientCreateRequest);

        // Agregar addresses
        boolean shouldSetActive = client.getAddresses() == null || client.getAddresses().isEmpty();
        boolean[] firstProcessed = {false};

        Client finalClient = client;
        Set<Address> addresses = clientCreateRequest.getAddresses().stream()
                .map(addressRequest -> {
                    Address address = AddressMapper.toAddress(addressRequest);
                    // Solo la primera dirección será activa
                    address.setActive(shouldSetActive && !firstProcessed[0]);
                    if (shouldSetActive && !firstProcessed[0]) {
                        firstProcessed[0] = true;
                    }
                    address.setClient(finalClient);
                    return address;
                })
                .collect(Collectors.toSet());

        // Crear stripeCustomerId
        CustomerCreateParams params = CustomerCreateParams.builder()
                .setEmail(client.getEmail())
                .setName(client.getFirstName() + " " + client.getLastName())
                .build();

        Customer customer;
        try {
            customer = Customer.create(params);
        } catch (StripeException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No se pudo crear stripeCustomerId"
            );
        }
        client.setStripeCustomerId(customer.getId());

        // Encriptar contraseña
        client.setPassword(passwordEncoder.encode(clientCreateRequest.getPassword()));

        client.setAddresses(addresses);
        client = clientRepository.save(client);

        return ClientMapper.toClientResponse(client);
    }

    @Transactional
    @Override
    public ClientResponse getClientByEmail(String email) {
        Client client =  clientRepository.findById(email).orElse(null);
        if (client == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Cliente con id " + email + " no fue encontrado"
            );
        }
        return ClientMapper.toClientResponse(client);
    }

    @Transactional
    @Override
    public List<ClientResponse> getClients() {
        List<Client> clients = clientRepository.findAll();
        return clients.stream().map(ClientMapper::toClientResponse).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public ClientResponse updateClient(ClientUpdateRequest clientUpdateRequest) {
        Client client = clientRepository.findById(clientUpdateRequest.getEmail()).orElse(null);

        if (client == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Cliente con id " + clientUpdateRequest.getEmail() + " no fue encontrado"
            );
        }
        // La contraseña por ejemplo no la va a actualizar, eso se hace en otro lado
        client.setFirstName(clientUpdateRequest.getFirstName());
        client.setLastName(clientUpdateRequest.getLastName());
        client.setBirthDate(clientUpdateRequest.getBirthDate());
        client.setDni(clientUpdateRequest.getDni());

        clientRepository.save(client);
        return ClientMapper.toClientResponse(client);
    }

    @Transactional
    @Override
    public ResponseEntity<Map<String, Object>> deleteClient(String email) {
        Client client = clientRepository.findById(email).orElse(null);
        if (client == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Cliente con id " + email + " no fue encontrado"
            );
        }

        clientRepository.delete(client);

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Cliente " + email + " fue eliminado");

        return ResponseEntity.ok(body);
    }
}
