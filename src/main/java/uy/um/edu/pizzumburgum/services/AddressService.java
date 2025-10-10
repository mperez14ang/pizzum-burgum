package uy.um.edu.pizzumburgum.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.repository.AddressRepository;

@Service
public class AddressService {
    @Autowired
    public AddressRepository addressRepository;

    public Address addAddress(Address address) {
        return addressRepository.save(address);
    }
}
