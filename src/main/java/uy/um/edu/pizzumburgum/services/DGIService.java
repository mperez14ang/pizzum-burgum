package uy.um.edu.pizzumburgum.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.response.DGIOrderResponse;
import uy.um.edu.pizzumburgum.entities.OrderBy;
import uy.um.edu.pizzumburgum.mapper.DGIMapper;
import uy.um.edu.pizzumburgum.repository.OrderByRepository;
import uy.um.edu.pizzumburgum.services.interfaces.DGIServiceInt;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DGIService implements DGIServiceInt {

    private final OrderByRepository orderByRepository;

    @Override
    public List<DGIOrderResponse> getOrdersByDate(LocalDate date) {
        List<OrderBy> orders = orderByRepository.findByCreatedAtDate(date);

        return orders.stream()
                .map(DGIMapper::toDGIOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DGIOrderResponse> getOrdersByDateRange(LocalDate startDate, LocalDate endDate) {
        List<OrderBy> orders = orderByRepository.findByCreatedAtBetween(startDate, endDate);

        return orders.stream()
                .map(DGIMapper::toDGIOrderResponse)
                .collect(Collectors.toList());
    }
}