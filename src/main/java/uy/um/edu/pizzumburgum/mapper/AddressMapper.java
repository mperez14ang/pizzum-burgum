package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.request.AddressRequest;
import uy.um.edu.pizzumburgum.dto.response.AddressResponse;
import uy.um.edu.pizzumburgum.entities.Address;
import uy.um.edu.pizzumburgum.entities.Client;

public class AddressMapper {
    // AddressRequest -> Address
    public static Address toAddress(AddressRequest addressRequest) {
        return Address.builder()
                .city(addressRequest.getCity())
                .street(addressRequest.getStreet())
                .postalCode(addressRequest.getPostalCode())
                .deleted(false)
                .build();
    }

    // Address -> AddressResponse
    public static AddressResponse toAddressResponse(Address address) {

        return AddressResponse.builder()
                .id(address.getId())
                .city(address.getCity())
                .street(address.getStreet())
                .postalCode(address.getPostalCode())
                .deleted(address.isDeleted())
                .active(address.getActive())
                .build();
    }
}
