package uy.um.edu.pizzumburgum.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.OrderByRequest;
import uy.um.edu.pizzumburgum.dto.response.OrderByResponse;
import uy.um.edu.pizzumburgum.entities.*;
import uy.um.edu.pizzumburgum.mapper.OrderByMapper;
import uy.um.edu.pizzumburgum.repository.AddressRepository;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.repository.OrderByRepository;
import uy.um.edu.pizzumburgum.repository.OrderHasCreationsRepository;
import uy.um.edu.pizzumburgum.services.interfaces.OrderByInt;

import java.util.*;

@Service
public class OrderByService implements OrderByInt {

    @Autowired
    private final OrderByRepository orderByRepository;

    @Autowired
    private final OrderHasCreationsRepository orderHasCreationsRepository;

    @Autowired
    private final AddressRepository addressRepository;

    @Autowired
    private final ClientRepository clientRepository;

    public OrderByService(OrderByRepository orderByRepository, OrderHasCreationsRepository orderHasCreationsRepository, AddressRepository addressRepository, ClientRepository clientRepository) {
        this.orderByRepository = orderByRepository;
        this.orderHasCreationsRepository = orderHasCreationsRepository;
        this.addressRepository = addressRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public OrderByResponse createOder(OrderByRequest orderByDtoRequest) {
        OrderBy orderBy = OrderByMapper.toOrderBy(orderByDtoRequest);

        // Setear creations (OrderHasCreations)
        Set<OrderHasCreations> orderHasCreations = new HashSet<>();
        for (Long creationsId : orderByDtoRequest.getCreations()){
            orderHasCreations.add(orderHasCreationsRepository.findById(creationsId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "OrderHasCreations con id : " + creationsId + " no encontrado"))
            );
        }

        orderBy.setCreations(orderHasCreations);

        // Setear address
        // Verificar que el address sea del cliente TODO

        Address address = addressRepository.findById(orderByDtoRequest.getAddress())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Address de order con id : " + orderByDtoRequest.getAddress() + " no encontrado"));

        orderBy.setAddress(address);

        // Setear client
        Client client = clientRepository.findById(orderByDtoRequest.getClientEmail())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cliente de orden " + orderBy.getId() + " con id " + orderByDtoRequest.getClientEmail() + " no encontrado"));

        orderBy.setClient(client);

        orderByRepository.save(orderBy);
        return OrderByMapper.toOrderByDto(orderBy);
    }

    @Override
    public OrderByResponse getOrderById(Long id) {
        OrderBy orderBy = orderByRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Orden " + id + " no encontrada"));
        return OrderByMapper.toOrderByDto(orderBy);
    }

    @Override
    public List<OrderByResponse> getOrders() {
        List<OrderBy> orderByList = orderByRepository.findAll();
        return orderByList.stream()
                .map(OrderByMapper::toOrderByDto)
                .toList();
    }

    @Override
    public List<OrderByResponse> getOrdersByState(OrderState state) {
        return this.getOrders().stream()
                .filter(orderBy -> {
                    return orderBy.getState().equals(state);
                })
                .toList();
    }

    @Override
    public OrderByResponse updateOrder(Long id, OrderByRequest orderByDto) {
        return null;
    }

    @Override
    public ResponseEntity<Map<String, Object>> deleteOrder(Long id) {
        OrderBy orderBy = orderByRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Orden " + id + " no encontrada"));
        orderByRepository.delete(orderBy);

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Orden " + orderBy.getId() + " fue eliminado");

        return ResponseEntity.ok(body);
    }

    public OrderByResponse updateOrderState(Long id, OrderState state) {
        OrderBy orderBy = orderByRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Orden " + id + " no encontrada"));

        orderBy.setState(state);
        orderByRepository.save(orderBy);

        return OrderByMapper.toOrderByDto(orderBy);
    }
}
