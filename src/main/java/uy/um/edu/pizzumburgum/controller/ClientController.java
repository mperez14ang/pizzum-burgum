package uy.um.edu.pizzumburgum.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.ClientDto;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.User;
import uy.um.edu.pizzumburgum.exception.ResourceNotFoundException;
import uy.um.edu.pizzumburgum.services.ClientService;

import java.util.List;

@RestController
@RequestMapping("/api/client")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }
    @PostMapping
    public ClientDto createClient(@RequestBody ClientDto client) {
        return clientService.createClient(client);
    }

    @GetMapping("{clientEmail}")
    public ClientDto getClientByEmail(@PathVariable String clientEmail) throws ResourceNotFoundException {
        return clientService.getClientByEmail(clientEmail);
    }

    @GetMapping
    public List<ClientDto> getAllClients() {
        return clientService.getClients();
    }
}
