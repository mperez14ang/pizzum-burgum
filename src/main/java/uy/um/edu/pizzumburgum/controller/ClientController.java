package uy.um.edu.pizzumburgum.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.request.AddressRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.AddressResponse;
import uy.um.edu.pizzumburgum.dto.response.CardResponse;
import uy.um.edu.pizzumburgum.dto.response.ClientResponse;
import uy.um.edu.pizzumburgum.exception.ResourceNotFoundException;
import uy.um.edu.pizzumburgum.services.AddressService;
import uy.um.edu.pizzumburgum.services.CardService;
import uy.um.edu.pizzumburgum.services.ClientService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/client/v1")
public class ClientController {
    private final ClientService clientService;
    private final AddressService addressService;
    private final CardService cardService;

    public ClientController(ClientService clientService, AddressService addressService,  CardService cardService) {
        this.clientService = clientService;
        this.addressService = addressService;
        this.cardService = cardService;
    }

    @PostMapping
    public ClientResponse createClient(@RequestBody ClientCreateRequest client) {
        return clientService.createClient(client);
    }

    @GetMapping("{clientEmail}")
    public ClientResponse getClientByEmail(@PathVariable String clientEmail){
        return clientService.getClientByEmail(clientEmail);
    }

    @PutMapping()
    public ClientResponse updateClient(@RequestBody ClientUpdateRequest clientUpdateRequest){
        return clientService.updateClient(clientUpdateRequest);
    }

    @DeleteMapping("{clientEmail}")
    public ResponseEntity<Map<String, Object>> deleteClient(@PathVariable String clientEmail) {
        return clientService.deleteClient(clientEmail);
    }

    @GetMapping
    public List<ClientResponse> getAllClients() {
        return clientService.getClients();
    }

    @PostMapping("{clientEmail}/address")
    public AddressResponse createAddress(@PathVariable String clientEmail, @RequestBody AddressRequest addressRequest) throws ResourceNotFoundException {
        return addressService.createAddress(addressRequest, clientEmail);
    }

    @GetMapping("{clientEmail}/cards")
    public List<CardResponse> getCardFromClient(@PathVariable String clientEmail) {
        return this.cardService.getCardsFromClient(clientEmail);
    }

}
