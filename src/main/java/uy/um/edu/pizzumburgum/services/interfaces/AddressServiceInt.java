package uy.um.edu.pizzumburgum.services.interfaces;

import uy.um.edu.pizzumburgum.dto.shared.AddressDto;

public interface AddressServiceInt {
    AddressDto createAddress(AddressDto addressDto, String clientEmail);

    AddressDto getAddress(Long addressId);

    AddressDto updateAddress(Long id, AddressDto addressDto);

    void deleteAddress(String clientEmail, Long addressId);
}
