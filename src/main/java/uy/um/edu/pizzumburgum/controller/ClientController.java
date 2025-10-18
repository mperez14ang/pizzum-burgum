package uy.um.edu.pizzumburgum.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.ClientDtoResponse;
import uy.um.edu.pizzumburgum.dto.shared.AddressDto;
import uy.um.edu.pizzumburgum.exception.ResourceNotFoundException;
import uy.um.edu.pizzumburgum.services.AddressService;
import uy.um.edu.pizzumburgum.services.ClientService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/client/v1")
public class ClientController {
    private final ClientService clientService;
    private final AddressService addressService;

    public ClientController(ClientService clientService, AddressService addressService) {
        this.clientService = clientService;
        this.addressService = addressService;
    }

    @PostMapping
    public ClientDtoResponse createClient(@RequestBody ClientCreateRequest client) {
        return clientService.createClient(client);
    }

    @GetMapping("{clientEmail}")
    public ClientDtoResponse getClientByEmail(@PathVariable String clientEmail){
        return clientService.getClientByEmail(clientEmail);
    }

    @PutMapping()
    public ClientDtoResponse updateClient(@RequestBody ClientUpdateRequest clientUpdateRequest){
        return clientService.updateClient(clientUpdateRequest);
    }

    @DeleteMapping("{clientEmail}")
    public ResponseEntity<Map<String, Object>> deleteClient(@PathVariable String clientEmail) {
        return clientService.deleteClient(clientEmail);
    }

    @GetMapping
    public List<ClientDtoResponse> getAllClients() {
        return clientService.getClients();
    }

    @PostMapping("{clientEmail}/address")
    public AddressDto createAddress(@PathVariable String clientEmail, @RequestBody AddressDto addressDto) throws ResourceNotFoundException {
        return addressService.createAddress(addressDto, clientEmail);
    }

}
