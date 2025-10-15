package uy.um.edu.pizzumburgum.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoritesDto {

    private Long id;

    private LocalDateTime createdAt;

    private String clientEmail;

    private Set<CreationDto> creations;
}
