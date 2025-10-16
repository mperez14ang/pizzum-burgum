package uy.um.edu.pizzumburgum.dto.response;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDtoResponse extends UserDtoResponse {

    private String createdById;
}
