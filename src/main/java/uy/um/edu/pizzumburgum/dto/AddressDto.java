package uy.um.edu.pizzumburgum.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AddressDto {
    private String street;
    private String city;
    private String postalCode;
    private Long clientId;
}
