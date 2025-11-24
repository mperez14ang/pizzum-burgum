package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoritesResponse {
    private Long id;

    private LocalDateTime createdAt;

    private String clientEmail;

    private Set<CreationResponse> creations;

    private boolean available;
}
