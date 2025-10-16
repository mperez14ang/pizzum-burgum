package uy.um.edu.pizzumburgum.mapper;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.shared.AddressDto;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;

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

        return AddressDto.builder()
                .city(address.getCity())
                .street(address.getStreet())
                .postalCode(address.getPostalCode())
                .build();
    }
}
