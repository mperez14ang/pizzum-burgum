package uy.um.edu.pizzumburgum.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.shared.AddressDto;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.mapper.AddressMapper;
import uy.um.edu.pizzumburgum.repository.AddressRepository;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.services.interfaces.AddressServiceInt;


@Service
@RequiredArgsConstructor
public class AddressService implements AddressServiceInt {

    private final AddressRepository addressRepository;
    private final ClientRepository clientRepository;

    @Transactional
    @Override
    public AddressDto createAddress(AddressDto addressDto, String clientEmail) {
        if (clientEmail == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El cliente es obligatorio para crear una dirección"
            );
        }

        Client client = clientRepository.getReferenceById(clientEmail);

        Address address = AddressMapper.toAddress(addressDto, client);
        addressRepository.save(address);

        return AddressMapper.toAddressDto(address);
    }

    @Transactional
    @Override
    public AddressDto getAddress(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "No se pudo encontrar una direccion con id " + addressId
        ));

        return AddressMapper.toAddressDto(address);
    }

    @Transactional
    @Override
    public AddressDto updateAddress(Long id, AddressDto addressDto) {
        Address address = addressRepository.getReferenceById(id);

        address.setCity(addressDto.getCity());
        address.setStreet(addressDto.getStreet());
        address.setPostalCode(addressDto.getPostalCode());

        addressRepository.save(address);
        return AddressMapper.toAddressDto(address);
    }

    @Transactional
    @Override
    public void deleteAddress(String clientEmail, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "No se pudo encontrar una direccion perteneciente a " + clientEmail));

        if (!address.getClient().getEmail().equals(clientEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,  "La direccion no pertenece a " + clientEmail
            );
        }

        addressRepository.delete(address);
    }
}
