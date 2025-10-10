package uy.um.edu.pizzumburgum.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.User;
import uy.um.edu.pizzumburgum.services.ClientService;

@RestController
@RequestMapping("/api/client")
public class ClientController {
    @Autowired
    public ClientService clientService;

    @PostMapping("/create")
    public User createClient(@RequestBody Client client) {
        return clientService.addClient(client);
    }
}
