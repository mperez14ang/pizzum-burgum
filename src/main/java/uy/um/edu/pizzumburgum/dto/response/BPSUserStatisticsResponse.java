package uy.um.edu.pizzumburgum.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BPSUserStatisticsResponse {
    private Long totalUsers;
    private Long clientUsers;
    private Long adminUsers;
}