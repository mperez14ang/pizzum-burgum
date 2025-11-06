package uy.um.edu.pizzumburgum.services.interfaces;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.ClientResponse;

import java.util.List;
import java.util.Map;

public interface ClientServiceInt {

    ClientResponse createClient(ClientCreateRequest clientCreateRequest);

    ClientResponse createClient(ClientCreateRequest clientCreateRequest, boolean validateDni);

    ClientResponse getClientByEmail(String email);

    List<ClientResponse> getClients();

    ClientResponse updateClient(ClientUpdateRequest clientUpdateRequest);

    ResponseEntity<Map<String, Object>> deleteClient(String email);
}
