package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.AddressDto;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;

public class AddressMapper {
    public static Address toAddress(AddressDto dto, Client client) {
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
                .clientId(address.getClient().getId())
                .city(address.getCity())
                .street(address.getStreet())
                .postalCode(address.getPostalCode())
                .build();
    }
}
