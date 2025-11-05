package uy.um.edu.pizzumburgum.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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

        if (address.getActive()) {
            client.getAddresses().forEach(a -> a.setActive(false));
            address.setActive(true);
        }


        // Setear el cliente
        address.setClient(client);
        client.getAddresses().add(address);

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

    public List<AddressResponse> getClientNonDeletedAddresses(String clientEmail) {
        Client client = clientRepository.findById(clientEmail)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.BAD_REQUEST, "No se pudo encontrar un cliente con email " + clientEmail)
                );

        return client.getAddresses().stream()
                .filter(address -> !address.isDeleted())
                .map(AddressMapper::toAddressResponse).toList();
    }

    @Transactional
    @Override
    public AddressResponse updateAddress(Long id, AddressRequest addressRequest, String clientEmail) {
        Address address = addressRepository.getReferenceById(id);

        isAddressFromClient(clientEmail, address.getClient());

        address.setCity(addressRequest.getCity());
        address.setStreet(addressRequest.getStreet());
        address.setPostalCode(addressRequest.getPostalCode());

        addressRepository.save(address);
        return AddressMapper.toAddressResponse(address);
    }

    @Transactional
    @Override
    public Map<String, Object> deleteAddress(String clientEmail, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "No se pudo encontrar una dirección perteneciente a " + clientEmail));

        Client client = address.getClient();

        this.isAddressFromClient(clientEmail, client);

        // Marcar como eliminada
        address.setDeleted(true);
        address.setActive(false);

        // Eliminar físicamente la dirección
        addressRepository.delete(address);

        // Asegurar que haya una activa (si borramos la activa anterior)
        if (address.getActive()) {
            client.getAddresses().stream()
                    .filter(a -> !a.isDeleted())
                    .findFirst()
                    .ifPresent(a -> a.setActive(true));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "La dirección " + addressId + " fue eliminada correctamente");
        return response;
    }

    @Override
    public AddressResponse setAsActive(Long id, String clientEmail) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "No se pudo encontrar una dirección perteneciente a " + clientEmail));

        if (address.isDeleted()){return null;}

        Client client = address.getClient();

        isAddressFromClient(clientEmail, client);

        // Setear todas las demas address de client a false
        client.getAddresses().forEach(a -> a.setActive(false));

        address.setActive(true);

        addressRepository.save(address);
        return AddressMapper.toAddressResponse(address);
    }

    private void isAddressFromClient(String clientEmail, Client client) {
        if (!client.getEmail().equals(clientEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "La dirección no pertenece a " + clientEmail
            );
        }
    }

}
