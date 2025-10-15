package uy.um.edu.pizzumburgum.dto;

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