package uy.um.edu.pizzumburgum.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.ClientDtoResponse;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.Favorites;
import uy.um.edu.pizzumburgum.mapper.AddressMapper;
import uy.um.edu.pizzumburgum.mapper.ClientMapper;
import uy.um.edu.pizzumburgum.mapper.FavoritesMapper;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.services.interfaces.ClientServiceInt;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService implements ClientServiceInt {

    private final ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public ClientDtoResponse createClient(ClientCreateRequest clientCreateRequest) {
        // Verificar que el cliente no existe
        if (clientRepository.existsById(clientCreateRequest.getEmail())){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Cliente con id " + clientCreateRequest.getEmail() + " ya existe"
            );
        }

        Client client = ClientMapper.toClient(clientCreateRequest);

        // Agregar addresses y favorites
        Client finalClient = client;
        Set<Address> addresses = clientCreateRequest.getAddresses().stream()
                .map(obj -> AddressMapper.toAddress(obj, finalClient))
                .collect(Collectors.toSet());

        Set<Favorites> favorites = clientCreateRequest.getFavorites().stream()
                .map(FavoritesMapper::toFavorites)
                .collect(Collectors.toSet());

        // Encriptar contraseña
        client.setPassword(passwordEncoder.encode(clientCreateRequest.getPassword()));

        client.setAddresses(addresses);
        client.setFavorites(favorites);
        client = clientRepository.save(client);

        return ClientMapper.toClientResponse(client);
    }

    @Transactional
    @Override
    public ClientDtoResponse getClientByEmail(String email) {
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
    public List<ClientDtoResponse> getClients() {
        List<Client> clients = clientRepository.findAll();
        return clients.stream().map(ClientMapper::toClientResponse).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public ClientDtoResponse updateClient(String clientEmail, ClientUpdateRequest clientUpdateRequest) {
        Client client = clientRepository.findById(clientEmail).orElse(null);

        if (client == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Cliente con id " + clientEmail + " no fue encontrado"
            );
        }
        // La contraseña por ejemplo no la va a actualizar, eso se hace en otro lado
        client.setUsername(clientUpdateRequest.getUsername());
        client.setLastName(clientUpdateRequest.getLastName());
        client.setBirthDate(clientUpdateRequest.getBirthDate());
        client.setDni(clientUpdateRequest.getDni());

        clientRepository.save(client);
        return ClientMapper.toClientResponse(client);
    }

    @Transactional
    @Override
    public ResponseEntity<String> deleteClient(String email) {
        Client client = clientRepository.findById(email).orElse(null);
        if (client == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Cliente con id " + email + " no fue encontrado"
            );
        }

        clientRepository.delete(client);
        return ResponseEntity.ok("Cliente " + email + " fue eliminado");
    }
}
