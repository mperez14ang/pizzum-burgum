package uy.um.edu.pizzumburgum.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.AddressDto;
import uy.um.edu.pizzumburgum.dto.ClientDto;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.mapper.AddressMapper;
import uy.um.edu.pizzumburgum.mapper.ClientMapper;
import uy.um.edu.pizzumburgum.repository.AddressRepository;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.repository.CreationHasProductsRepository;
import uy.um.edu.pizzumburgum.repository.OrderHasCreationsRepository;
import uy.um.edu.pizzumburgum.services.interfaces.AddressServiceInt;


@Service
public class AddressService implements AddressServiceInt {

    private final AddressRepository addressRepository;
    private final ClientRepository clientRepository;
    private final CreationHasProductsRepository creationHasProductsRepository;
    private final OrderHasCreationsRepository orderHasCreationsRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository, ClientRepository clientRepository, CreationHasProductsRepository creationHasProductsRepository, OrderHasCreationsRepository orderHasCreationsRepository) {
        this.addressRepository = addressRepository;
        this.clientRepository = clientRepository;
        this.creationHasProductsRepository = creationHasProductsRepository;
        this.orderHasCreationsRepository = orderHasCreationsRepository;
    }

    public AddressDto createAddress(AddressDto addressDto, ClientDto clientDto) {
        if (clientDto == null || clientDto.getEmail() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El cliente es obligatorio para crear una dirección"
            );
        }

        Client client = ClientMapper.toClient(clientDto, clientRepository, creationHasProductsRepository, orderHasCreationsRepository);

        Address address = AddressMapper.toAddress(addressDto, client);
        addressRepository.save(address);

        return AddressMapper.toAddressDto(address);
    }
}
