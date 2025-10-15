package uy.um.edu.pizzumburgum.mapper;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.AddressDto;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.repository.ClientRepository;

import java.util.Set;

public class AddressMapper {
    public static Address toAddress(AddressDto addressDto, Client client) {

        return Address.builder()
                .city(addressDto.getCity())
                .street(addressDto.getStreet())
                .postalCode(addressDto.getPostalCode())
                .active(true)
                .client(client)
                .build();
    }


    public static AddressDto toAddressDto(Address address) {

        String clientEmail = null;
        if (address.getClient() != null) {
            clientEmail = address.getClient().getEmail();
        }
        else{
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No puede haber un address sin correo");
        }

        return AddressDto.builder()
                .clientEmail(clientEmail)
                .city(address.getCity())
                .street(address.getStreet())
                .postalCode(address.getPostalCode())
                .build();
    }
}
