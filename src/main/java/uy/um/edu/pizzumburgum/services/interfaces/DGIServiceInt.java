package uy.um.edu.pizzumburgum.services.interfaces;

import uy.um.edu.pizzumburgum.dto.response.DGIOrderResponse;

import java.time.LocalDate;
import java.util.List;

public interface DGIServiceInt {
    /**
     * Obtiene todas las ordenes de un día específico
     * @param date Fecha para la cual se buscan las ordenes
     * @return Lista de ordenes en formato DGI
     */
    List<DGIOrderResponse> getOrdersByDate(LocalDate date);

    /**
     * Obtiene todas las ordenes en un rango de fechas
     * @param startDate Fecha inicial (inclusive)
     * @param endDate Fecha final (inclusive)
     * @return Lista de ordenes en formato DGI
     */
    List<DGIOrderResponse> getOrdersByDateRange(LocalDate startDate, LocalDate endDate);
}