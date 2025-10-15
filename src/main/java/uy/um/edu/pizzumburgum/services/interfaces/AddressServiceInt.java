package uy.um.edu.pizzumburgum.services.interfaces;

import uy.um.edu.pizzumburgum.dto.AddressDto;
import uy.um.edu.pizzumburgum.dto.ClientDto;

public interface AddressServiceInt {
    AddressDto createAddress(AddressDto addressDto, ClientDto clientDto);
}
