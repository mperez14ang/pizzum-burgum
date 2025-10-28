package uy.um.edu.pizzumburgum.services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.OrderByRequest;
import uy.um.edu.pizzumburgum.dto.response.OrderByResponse;
import uy.um.edu.pizzumburgum.entities.*;
import uy.um.edu.pizzumburgum.mapper.OrderByMapper;
import uy.um.edu.pizzumburgum.mapper.OrderHasCreationsMapper;
import uy.um.edu.pizzumburgum.repository.*;
import uy.um.edu.pizzumburgum.services.interfaces.OrderByInt;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderByService implements OrderByInt {

    @Autowired
    private final OrderByRepository orderByRepository;

    @Autowired
    private final AddressRepository addressRepository;

    @Autowired
    private final ClientRepository clientRepository;

    @Autowired
    private CreationRepository creationRepository;

    public OrderByService(OrderByRepository orderByRepository, AddressRepository addressRepository, ClientRepository clientRepository) {
        this.orderByRepository = orderByRepository;
        this.addressRepository = addressRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public OrderByResponse createOrder(OrderByRequest orderByDtoRequest) {
        OrderBy orderBy = OrderByMapper.toOrderBy(orderByDtoRequest);

        // Convertir OrderHasCreationsDto a OrderHasCreations
        Set<OrderHasCreations> orderHasCreations = new HashSet<>();
        List<Creation> orders = creationRepository.findAll();
        if  (orderByDtoRequest.getCreations() != null) {
            orderHasCreations = orderByDtoRequest.getCreations().stream()
                    .map(c -> {
                        OrderHasCreations orderHasCreations1 = OrderHasCreationsMapper.toOrderHasCreations(c);

                        Long creationId = c.getCreationId();
                        Creation creation = orders.stream().filter(o -> o.getId().equals(creationId)).findFirst()
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontro una creacion con id " + creationId));

                        orderHasCreations1.setOrder(orderBy);
                        orderHasCreations1.setCreation(creation);
                        return orderHasCreations1;
                    }).collect(Collectors.toSet());
        }

        orderBy.setCreations(orderHasCreations);

        Client client = clientRepository.findById(orderByDtoRequest.getClientEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cliente de orden " + orderBy.getId() + " con id " + orderByDtoRequest.getClientEmail() + " no encontrado"));


        Address address;
        // Si la direccion es null, obtener la primera del cliente
        if (orderBy.getAddress() == null) {
            address = client.getAddresses().stream()
                    .findFirst()
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "El cliente no tiene direcciones registradas"
                    ));
        }
        else {
            address = addressRepository.findById(orderByDtoRequest.getAddress())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Address de order con id : " + orderByDtoRequest.getAddress() + " no encontrado"));
        }

        // Verificar que address sea del cliente
        if (!client.getAddresses().contains(address)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El address de la orden con el cliente no coincide");
        }

        // Setear address y client
        orderBy.setAddress(address);
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

    /** Esto actualiza la orden segun lo que venga **/
    @Transactional
    @Override
    public OrderByResponse updateOrder(Long id, OrderByRequest orderByDto) {
        OrderBy existingOrder = orderByRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Orden " + id + " no encontrada"));

        if (orderByDto.getState() != null) {
            existingOrder.setState(orderByDto.getState());
        }

        if (orderByDto.getAddress() != null) {
            Address newAddress = addressRepository.findById(orderByDto.getAddress())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Address con id " + orderByDto.getAddress() + " no encontrado"));

            // Si pasa un cliente, verificar relación
            if (orderByDto.getClientEmail() != null) {
                Client client = clientRepository.findById(orderByDto.getClientEmail())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Cliente con id " + orderByDto.getClientEmail() + " no encontrado"));

                if (!client.getAddresses().contains(newAddress)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "El address de la orden no pertenece al cliente");
                }

                existingOrder.setClient(client);
            } else if (existingOrder.getClient() != null &&
                    !existingOrder.getClient().getAddresses().contains(newAddress)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El address no pertenece al cliente actual de la orden");
            }

            existingOrder.setAddress(newAddress);
        }

        // Actualizar cliente (si viene y no vino address)
        if (orderByDto.getClientEmail() != null && orderByDto.getAddress() == null) {
            Client client = clientRepository.findById(orderByDto.getClientEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Cliente con id " + orderByDto.getClientEmail() + " no encontrado"));
            existingOrder.setClient(client);
        }

        // Actualizar creations (si vienen)
        if (orderByDto.getCreations() != null) {
            Set<OrderHasCreations> updatedCreations = orderByDto.getCreations().stream().map(c -> {
                OrderHasCreations ohc = OrderHasCreationsMapper.toOrderHasCreations(c);

                Creation creation = creationRepository.findById(c.getCreationId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "No se encontró una creación con id " + c.getCreationId()));

                ohc.setOrder(existingOrder);
                ohc.setCreation(creation);
                return ohc;
            }).collect(Collectors.toSet());

            existingOrder.setCreations(updatedCreations);
        }

        // Guardar cambios
        orderByRepository.saveAndFlush(existingOrder);

        return OrderByMapper.toOrderByDto(existingOrder);
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
