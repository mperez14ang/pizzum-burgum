package uy.um.edu.pizzumburgum.controller;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.request.AddressRequest;
import uy.um.edu.pizzumburgum.dto.request.ChangePasswordRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.AddressResponse;
import uy.um.edu.pizzumburgum.dto.response.CardResponse;
import uy.um.edu.pizzumburgum.dto.response.ClientResponse;
import uy.um.edu.pizzumburgum.dto.response.FavoritesResponse;
import uy.um.edu.pizzumburgum.exception.ResourceNotFoundException;
import uy.um.edu.pizzumburgum.services.AddressService;
import uy.um.edu.pizzumburgum.services.CardService;
import uy.um.edu.pizzumburgum.services.ClientService;
import uy.um.edu.pizzumburgum.services.FavoritesService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/client/v1")
public class ClientController {
    private final ClientService clientService;
    private final AddressService addressService;
    private final CardService cardService;
    private final FavoritesService favoritesService;

    public ClientController(ClientService clientService, AddressService addressService, CardService cardService, FavoritesService favoritesService) {
        this.clientService = clientService;
        this.addressService = addressService;
        this.cardService = cardService;
        this.favoritesService = favoritesService;
    }

    @PostMapping
    public ClientResponse createClient(@RequestBody ClientCreateRequest client) {
        return clientService.createClient(client);
    }

    @GetMapping("/{clientEmail}")
    public ClientResponse getClientByEmail(@PathVariable String clientEmail){
        return clientService.getClientByEmail(clientEmail);
    }

    @Transactional
    @PutMapping
    public ClientResponse updateClient(@RequestBody ClientUpdateRequest clientUpdateRequest){
        return clientService.updateClient(clientUpdateRequest);
    }

    @DeleteMapping("{clientEmail}")
    public ResponseEntity<Map<String, Object>> deleteClient(@PathVariable String clientEmail) {
        return clientService.deleteClient(clientEmail);
    }
    @Transactional
    @GetMapping
    public List<ClientResponse> getAllClients() {
        return clientService.getClients();
    }

    // Address endpoints

    @PostMapping("{clientEmail}/address")
    public AddressResponse createAddress(@PathVariable String clientEmail, @RequestBody AddressRequest addressRequest) throws ResourceNotFoundException {
        return addressService.createAddress(addressRequest, clientEmail);
    }

    @GetMapping("{clientEmail}/cards")
    public List<CardResponse> getCardFromClient(@PathVariable String clientEmail) {
        return this.cardService.getCardsFromClient(clientEmail);
    }

    /**
     * Obtener favoritos de un cliente específico
     * GET /api/favorites/client/{clientEmail}
     */
    @GetMapping("/favorites/{clientEmail}")
    public ResponseEntity<List<FavoritesResponse>> getFavoritesByClient(@PathVariable String clientEmail) {
        return ResponseEntity.ok(favoritesService.getFavoritesByClientEmail(clientEmail));
    }

}
