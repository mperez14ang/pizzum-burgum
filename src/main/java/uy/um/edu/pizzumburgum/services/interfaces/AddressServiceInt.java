package uy.um.edu.pizzumburgum.services.interfaces;

import jakarta.transaction.Transactional;
import uy.um.edu.pizzumburgum.dto.request.AddressRequest;
import uy.um.edu.pizzumburgum.dto.response.AddressResponse;

import java.util.List;
import java.util.Map;

public interface AddressServiceInt {
    AddressResponse createAddress(AddressRequest addressRequest, String clientEmail);

    AddressResponse getAddress(Long addressId);

    @Transactional
    List<AddressResponse> getClientAddresses(String clientEmail);

    AddressResponse updateAddress(Long id, AddressResponse addressResponse);

    Map<String, Object> deleteAddress(String clientEmail, Long addressId);
}
