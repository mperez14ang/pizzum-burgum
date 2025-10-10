package uy.um.edu.pizzumburgum.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.AddressDto;
import uy.um.edu.pizzumburgum.dto.ClientDto;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.mapper.AddressMapper;
import uy.um.edu.pizzumburgum.mapper.ClientMapper;
import uy.um.edu.pizzumburgum.repository.AddressRepository;
import uy.um.edu.pizzumburgum.services.interfaces.AddressServiceInt;


@Service
public class AddressService implements AddressServiceInt {

    private final AddressRepository addressRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public AddressDto createAddress(AddressDto addressDto, ClientDto clientDto) {
        Address address = AddressMapper.toAddress(addressDto, ClientMapper.toClient(clientDto));
        addressRepository.save(address);
        return AddressMapper.toAddressDto(address);
    }
}
