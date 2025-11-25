package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CardOwnerResponse {

    private String clientEmail;
    private String firstName;
    private String lastName;
    private String dni;
    private LocalDate birthDate;
}