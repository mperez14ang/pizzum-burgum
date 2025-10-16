package uy.um.edu.pizzumburgum.dto.shared;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderHasCreationsDto {

    private Long id;

    private int quantity;

    private Long creationId;

    private Long orderId;
}