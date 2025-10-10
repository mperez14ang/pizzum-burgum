package uy.um.edu.pizzumburgum.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.repository.ClientRepository;

@Service
public class ClientService {
    @Autowired
    public ClientRepository clientRepository;

    public Client addClient(Client client){
        return clientRepository.save(client);
    }
}
