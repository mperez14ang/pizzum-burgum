package uy.um.edu.pizzumburgum.dto.shared;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto {

    @Email
    private String email;

    private String password;
}
