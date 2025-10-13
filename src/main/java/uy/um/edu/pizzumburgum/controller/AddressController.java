package uy.um.edu.pizzumburgum.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.AddressDto;
import uy.um.edu.pizzumburgum.dto.ClientDto;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.User;
import uy.um.edu.pizzumburgum.exception.ResourceNotFoundException;
import uy.um.edu.pizzumburgum.mapper.AddressMapper;
import uy.um.edu.pizzumburgum.services.AddressService;
import uy.um.edu.pizzumburgum.services.ClientService;
import uy.um.edu.pizzumburgum.services.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final AddressService addressService;
    private final ClientService clientService;

    @Autowired
    public AddressController(AddressService addressService, ClientService clientService) {
        this.addressService = addressService;
        this.clientService = clientService;
    }

    @PostMapping
    public AddressDto createAddress(@RequestBody AddressDto addressDto) throws ResourceNotFoundException {

        // Busca el usuario y si no existe returna error
        ClientDto clientDto = clientService.getClientByEmail(addressDto.getClientEmail());

        return addressService.createAddress(addressDto, clientDto);
    }

}
