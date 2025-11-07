package uy.um.edu.pizzumburgum.services.interfaces;

import uy.um.edu.pizzumburgum.dto.response.BPSUserStatisticsResponse;

public interface BPSServiceInt {
    /**
     * Obtiene estadísticas de usuarios del sistema
     * @return Estadísticas con total de usuarios, clientes y administradores
     */
    BPSUserStatisticsResponse getUserStatistics();
}