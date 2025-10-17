package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.ClientDtoResponse;

import java.util.List;

public interface ClientServiceInt {

    ClientDtoResponse createClient(ClientCreateRequest clientCreateRequest);

    ClientDtoResponse getClientByEmail(String email);

    List<ClientDtoResponse> getClients();

    ClientDtoResponse updateClient(ClientUpdateRequest clientUpdateRequest);

    ResponseEntity<String> deleteClient(String email);
}
