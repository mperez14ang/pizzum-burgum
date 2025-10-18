package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.response.ClientDtoResponse;
import uy.um.edu.pizzumburgum.dto.shared.AddressDto;
import uy.um.edu.pizzumburgum.dto.shared.FavoritesDto;
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
    public static ClientDtoResponse toClientResponse(Client client) {
        Set<AddressDto> addressDtos = null;
        if (client.getAddresses() != null) {
            addressDtos = client.getAddresses().stream()
                    .map(AddressMapper::toAddressDto)
                    .collect(Collectors.toSet());
        }

        Set<FavoritesDto> favoritesDtos = null;
        if (client.getFavorites() != null) {
            favoritesDtos = client.getFavorites().stream()
                    .map(FavoritesMapper::toFavoritesDto)
                    .collect(Collectors.toSet());
        }

        return ClientDtoResponse.builder()
                .email(client.getEmail())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .birthDate(client.getBirthDate())
                .addresses(addressDtos)
                .favorites(favoritesDtos)
                .userType(client.getUserType())
                .build();

    }
}
