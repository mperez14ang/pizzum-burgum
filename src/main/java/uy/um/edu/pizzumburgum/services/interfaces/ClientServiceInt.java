package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.ClientDtoResponse;

import java.util.List;
import java.util.Map;

public interface ClientServiceInt {

    ClientDtoResponse createClient(ClientCreateRequest clientCreateRequest);

    ClientDtoResponse getClientByEmail(String email);

    List<ClientDtoResponse> getClients();

    ClientDtoResponse updateClient(ClientUpdateRequest clientUpdateRequest);

    ResponseEntity<Map<String, Object>> deleteClient(String email);
}
