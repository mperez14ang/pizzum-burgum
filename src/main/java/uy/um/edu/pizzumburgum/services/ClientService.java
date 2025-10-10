package uy.um.edu.pizzumburgum.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.ClientDto;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.exception.ResourceNotFoundException;
import uy.um.edu.pizzumburgum.mapper.ClientMapper;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.services.interfaces.ClientServiceInt;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClientService implements ClientServiceInt {
    @Autowired
    public ClientRepository clientRepository;

    @Override
    public ClientDto createClient(ClientDto clientDto) {
        Client client = ClientMapper.toClient(clientDto);
        clientRepository.save(client);
        return ClientMapper.toClientDto(client);
    }

    @Override
    public ClientDto getClientById(Long id) throws ResourceNotFoundException {
        Client client =  clientRepository.findById(id).orElse(null);
        if (client == null) {
            throw new ResourceNotFoundException("Client with id " + id + " not found");
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
