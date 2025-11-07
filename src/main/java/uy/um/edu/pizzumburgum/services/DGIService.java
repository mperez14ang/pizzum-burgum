package uy.um.edu.pizzumburgum.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.response.DGIOrderResponse;
import uy.um.edu.pizzumburgum.entities.OrderBy;
import uy.um.edu.pizzumburgum.mapper.DGIMapper;
import uy.um.edu.pizzumburgum.repository.OrderByRepository;
import uy.um.edu.pizzumburgum.services.interfaces.DGIServiceInt;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DGIService implements DGIServiceInt {

    private final OrderByRepository orderByRepository;

    @Override
    public List<DGIOrderResponse> getOrdersByDate(LocalDate date) {
        // Convertir LocalDate a LocalDateTime para el inicio y fin del día
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        List<OrderBy> orders = orderByRepository.findByCreatedAtBetween(startOfDay, endOfDay);

        return orders.stream()
                .map(DGIMapper::toDGIOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DGIOrderResponse> getOrdersByDateRange(LocalDate startDate, LocalDate endDate) {
        // Convertir LocalDate a LocalDateTime
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

        List<OrderBy> orders = orderByRepository.findByCreatedAtBetween(startDateTime, endDateTime);

        return orders.stream()
                .map(DGIMapper::toDGIOrderResponse)
                .collect(Collectors.toList());
    }
}