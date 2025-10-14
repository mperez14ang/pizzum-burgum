package uy.um.edu.pizzumburgum.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreationDto {
    @Id
    private Long id;

    private String name;

    private int type;

    private float price;
}
