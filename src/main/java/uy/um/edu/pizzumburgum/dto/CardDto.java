package uy.um.edu.pizzumburgum.dto;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CardDto {
    @Id
    private Long id;

    private String brand;

    private String last4Digits;

    private int expirationYear;

    private int expirationMonth;
}
