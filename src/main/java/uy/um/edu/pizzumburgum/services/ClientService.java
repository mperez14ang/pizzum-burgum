package uy.um.edu.pizzumburgum.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.ClientDto;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.exception.ResourceNotFoundException;
import uy.um.edu.pizzumburgum.mapper.ClientMapper;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.repository.CreationHasProductsRepository;
import uy.um.edu.pizzumburgum.repository.OrderHasCreationsRepository;
import uy.um.edu.pizzumburgum.services.interfaces.ClientServiceInt;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClientService implements ClientServiceInt {
    private final ClientRepository clientRepository;

    private final CreationHasProductsRepository creationHasProductsRepository;

    private final OrderHasCreationsRepository orderHasCreationsRepository;

    @Autowired
    public ClientService(ClientRepository clientRepository, CreationHasProductsRepository creationHasProductsRepository, OrderHasCreationsRepository orderHasCreationsRepository) {
        this.clientRepository = clientRepository;
        this.creationHasProductsRepository = creationHasProductsRepository;
        this.orderHasCreationsRepository = orderHasCreationsRepository;
    }

    @Override
    public ClientDto createClient(ClientDto clientDto) {
        if (clientDto.getEmail() == null || clientDto.getEmail().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El email es obligatorio"
            );
        }
        Client client = ClientMapper.toClient(clientDto, clientRepository, creationHasProductsRepository, orderHasCreationsRepository);
        clientRepository.save(client);
        return ClientMapper.toClientDto(client);
    }

    @Override
    public ClientDto getClientByEmail(String email) throws ResourceNotFoundException {
        Client client =  clientRepository.findById(email).orElse(null);
        if (client == null) {
            throw new ResourceNotFoundException("Client with id " + email + " not found");
        }
        return ClientMapper.toClientDto(client);
    }

    @Override
    public List<ClientDto> getClients() {
        List<Client> clients = clientRepository.findAll();
        List<ClientDto> clientDtos = new ArrayList<>();
        for (Client client : clients) {
            clientDtos.add(ClientMapper.toClientDto(client));
        }
        return clientDtos;
    }
}
