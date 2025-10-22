package uy.um.edu.pizzumburgum.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @Email
    private String email;

    private String password;
}
