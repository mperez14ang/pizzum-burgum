package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.AddressDto;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.repository.ClientRepository;

public class AddressMapper {
    public static Address toAddress(AddressDto dto, ClientRepository clientRepository) {
        return Address.builder()
                .city(dto.getCity())
                .street(dto.getStreet())
                .postalCode(dto.getPostalCode())
                .client(client)
                .active(true)
                .build();
    }

    public static AddressDto toAddressDto(Address address) {
        return AddressDto.builder()
                .clientEmail(address.getClient().getEmail())
                .city(address.getCity())
                .street(address.getStreet())
                .postalCode(address.getPostalCode())
                .build();
    }
}
