package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.response.AddressResponse;
import uy.um.edu.pizzumburgum.dto.response.ClientResponse;
import uy.um.edu.pizzumburgum.entities.Client;

import java.util.Set;
import java.util.stream.Collectors;

public class ClientMapper {

    // Client Request -> Client Entity
    public static Client toClient(ClientCreateRequest clientCreateRequest) {
        return Client.builder()
                .email(clientCreateRequest.getEmail())
                .firstName(clientCreateRequest.getFirstName())
                .lastName(clientCreateRequest.getLastName())
                .dni(clientCreateRequest.getDni())
                .birthDate(clientCreateRequest.getBirthDate())
                .password(clientCreateRequest.getPassword())
                .build();
    }

    // Client Entity -> Client Response
    public static ClientResponse toClientResponse(Client client) {
        Set<AddressResponse> addressDtos = null;
        if (client.getAddresses() != null) {
            addressDtos = client.getAddresses().stream()
                    .map(AddressMapper::toAddressResponse)
                    .collect(Collectors.toSet());
        }

        return ClientResponse.builder()
                .email(client.getEmail())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .birthDate(client.getBirthDate())
                .addresses(addressDtos)
                .userType(client.getUserType())
                .build();

    }
}
