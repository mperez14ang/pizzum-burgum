package uy.um.edu.pizzumburgum.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoritesDto {

    private Long id;
    private LocalDateTime createdAt;
    private String clientEmail;
    private Long creationId;
    private CreationDto creation;
}
