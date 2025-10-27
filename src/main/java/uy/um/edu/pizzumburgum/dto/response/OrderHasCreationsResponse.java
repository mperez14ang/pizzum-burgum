package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.um.edu.pizzumburgum.dto.request.CreationRequest;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderHasCreationsResponse {
    private int quantity;

    private CreationResponse creation;
}