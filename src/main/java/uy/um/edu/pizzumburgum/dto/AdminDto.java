package uy.um.edu.pizzumburgum.dto;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDto {

    private String email;

    private String userName;

    private String lastName;

    private String password;

    private LocalDate birthDate;

    private String dni;

    private String createdById;
}
