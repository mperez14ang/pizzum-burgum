package uy.um.edu.pizzumburgum.dto.request;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderHasCreationsRequest {

    private Long id;

    private int quantity;

    private Long creationId;
}