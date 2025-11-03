package uy.um.edu.pizzumburgum.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordRequest {
    private String email;

    private String oldPassword;

    private String password;

    private String passwordConfirmation;
}
