package uy.um.edu.pizzumburgum.services.interfaces;

import uy.um.edu.pizzumburgum.dto.request.AddressRequest;
import uy.um.edu.pizzumburgum.dto.response.AddressResponse;

public interface AddressServiceInt {
    AddressResponse createAddress(AddressRequest addressRequest, String clientEmail);

    AddressResponse getAddress(Long addressId);

    AddressResponse updateAddress(Long id, AddressResponse addressResponse);

    void deleteAddress(String clientEmail, Long addressId);
}
