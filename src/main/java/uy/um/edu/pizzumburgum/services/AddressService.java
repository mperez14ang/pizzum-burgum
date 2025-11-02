package uy.um.edu.pizzumburgum.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.AddressRequest;
import uy.um.edu.pizzumburgum.dto.response.AddressResponse;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.mapper.AddressMapper;
import uy.um.edu.pizzumburgum.repository.AddressRepository;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.services.interfaces.AddressServiceInt;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class AddressService implements AddressServiceInt {

    private final AddressRepository addressRepository;
    private final ClientRepository clientRepository;

    @Transactional
    @Override
    public AddressResponse createAddress(AddressRequest addressRequest, String clientEmail) {
        if (clientEmail == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El cliente es obligatorio para crear una dirección"
            );
        }

        Address address = AddressMapper.toAddress(addressRequest);
        Client client = clientRepository.getReferenceById(clientEmail);

        // Seleccionar address como predeteminada
        if (client.getAddresses().isEmpty()){
            address.setActive(true);
        }

        // Setear el cliente
        address.setClient(client);

        addressRepository.save(address);

        return AddressMapper.toAddressResponse(address);
    }

    @Transactional
    @Override
    public AddressResponse getAddress(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "No se pudo encontrar una direccion con id " + addressId
        ));

        return AddressMapper.toAddressResponse(address);
    }

    @Transactional
    @Override
    public List<AddressResponse> getClientAddresses(String clientEmail) {
        Client client = clientRepository.findById(clientEmail)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.BAD_REQUEST, "No se pudo encontrar un cliente con email " + clientEmail)
                );

        return client.getAddresses().stream()
                .map(AddressMapper::toAddressResponse).toList();
    }

    @Transactional
    @Override
    public AddressResponse updateAddress(Long id, AddressResponse addressResponse) {
        Address address = addressRepository.getReferenceById(id);

        address.setCity(addressResponse.getCity());
        address.setStreet(addressResponse.getStreet());
        address.setPostalCode(addressResponse.getPostalCode());

        addressRepository.save(address);
        return AddressMapper.toAddressResponse(address);
    }

    @Transactional
    @Override
    public Map<String, Object> deleteAddress(String clientEmail, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "No se pudo encontrar una direccion perteneciente a " + clientEmail));

        if (!address.getClient().getEmail().equals(clientEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "La direccion no pertenece a " + clientEmail
            );
        }

        address.setActive(false);
        address.setDeleted(true);

        Client client = address.getClient();

        if (!client.getAddresses().isEmpty()) {
            client.getAddresses().stream()
                    .filter(a -> !a.isDeleted())
                    .findFirst()
                    .ifPresent(a -> a.setActive(true));
        }

        addressRepository.save(address);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "La dirección " + addressId + " fue eliminada");
        return response;
    }
}
