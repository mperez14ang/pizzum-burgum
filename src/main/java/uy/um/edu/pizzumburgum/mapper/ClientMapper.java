package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.AddressDto;
import uy.um.edu.pizzumburgum.dto.ClientDto;
import uy.um.edu.pizzumburgum.dto.FavoritesDto;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.Favorites;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.repository.CreationHasProductsRepository;
import uy.um.edu.pizzumburgum.repository.OrderHasCreationsRepository;

import java.util.HashSet;
import java.util.Set;

public class ClientMapper {
    public static Client toClient(
            ClientDto clientDto, ClientRepository clientRepository,
            CreationHasProductsRepository creationHasProductsRepository, OrderHasCreationsRepository orderHasCreationsRepository
    ) {
        Client client = Client.builder()
                .email(clientDto.getEmail())
                .userName(clientDto.getUserName())
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
                addresses.add(address);
            }
            client.setAddresses(addresses);

        }

        // Agregar favoritos a client
        Set<FavoritesDto>  favoriteDtos = clientDto.getFavorites();
        if (favoriteDtos != null) {
            Set<Favorites> favorites = new HashSet<>();
            for (FavoritesDto favoritesDto : favoriteDtos) {
                favorites.add(FavoritesMapper.toFavorites(favoritesDto, clientRepository, creationHasProductsRepository, orderHasCreationsRepository));
            }
            client.setFavorites(favorites);
        }

        return client;
    }

    public static ClientDto toClientDto(Client client) {
        ClientDto clientDto = ClientDto.builder()
                .email(client.getEmail())
                .userName(client.getUsername())
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
                addressesDto.add(addressDto);
            }
            clientDto.setAddresses(addressesDto);

        }

        // Agregar favorites a ClientDto
        Set<Favorites> favorites = client.getFavorites();
        if (favorites != null) {
            Set<FavoritesDto> favoritesDto = new HashSet<>();
            for (Favorites favorite : favorites) {
                FavoritesDto favoriteDto = FavoritesMapper.toFavoritesDto(favorite);
                favoritesDto.add(favoriteDto);
            }
            clientDto.setFavorites(favoritesDto);
        }

        return clientDto;
    }
}
