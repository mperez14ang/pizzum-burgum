package uy.um.edu.pizzumburgum.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.AddressDto;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.User;
import uy.um.edu.pizzumburgum.mapper.AddressMapper;
import uy.um.edu.pizzumburgum.services.AddressService;
import uy.um.edu.pizzumburgum.services.ClientService;
import uy.um.edu.pizzumburgum.services.UserService;

import java.util.Optional;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    public AddressService addressService;
    public ClientService clientService;

    @PostMapping("/create")
    public Address createAddress(@RequestBody AddressDto dto) {

        // Busca el usuario y si no existe returna error
        Optional<Client> client = clientService.clientRepository.findById(dto.getClientId());
        if (client.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Address address = AddressMapper.toAddress(dto, client.get());
        System.out.println(address.getClient().getId());

        return addressService.addAddress(address);
    }
}
