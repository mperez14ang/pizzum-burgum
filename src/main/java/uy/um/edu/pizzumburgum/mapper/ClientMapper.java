package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.AddressDto;
import uy.um.edu.pizzumburgum.dto.ClientDto;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;

import java.util.HashSet;
import java.util.Set;

public class ClientMapper {
    public static Client toClient(ClientDto clientDto) {
        Client client = Client.builder()
                .email(clientDto.getEmail())
                .username(clientDto.getUsername())
                .lastName(clientDto.getLastName())
                .dni(clientDto.getDni())
                .birthDate(clientDto.getBirthDate())
                .password(clientDto.getPassword())
                .build();

        // Agregar los AddressDto a Client
        Set<AddressDto> addressDtos = clientDto.getAddresses();
        if (addressDtos != null) {
            Set<Address> addresses = new HashSet<>();
            for (AddressDto addressDto : addressDtos) {
                Address address = AddressMapper.toAddress(addressDto, client);
                address.setClient(client);
                addresses.add(address);
            }
            client.setAddresses(addresses);

        }
        return client;
    }

    public static ClientDto toClientDto(Client client) {
        ClientDto clientDto = ClientDto.builder()
                .email(client.getEmail())
                .username(client.getUsername())
                .lastName(client.getLastName())
                .dni(client.getDni())
                .birthDate(client.getBirthDate())
                .password(client.getPassword())
                .build();

        // Agregar los Address a ClientDto
        Set<Address> addresses = client.getAddresses();
        if (addresses != null) {
            Set<AddressDto> addressesDto = new HashSet<>();
            for (Address address : addresses) {
                AddressDto addressDto = AddressMapper.toAddressDto(address);
                addressDto.setClientEmail(client.getEmail());
                addressesDto.add(addressDto);
            }
            clientDto.setAddresses(addressesDto);

        }
        return clientDto;
    }
}
