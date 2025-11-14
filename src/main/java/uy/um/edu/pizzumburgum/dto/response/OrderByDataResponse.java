package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.entities.OrderState;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderByDataResponse {
    private Long id;

    private String address;

    private String clientEmail;

    private OrderState state;

    private LocalDate dateCreated;
}
