package uy.um.edu.pizzumburgum.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
public class AvatarResponse {
    private String userEmail;

    private String profileUrl;
}
