package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.CreationRequest;
import uy.um.edu.pizzumburgum.dto.response.CreationResponse;

import java.util.List;

public interface CreationServiceInt {
    CreationResponse createCreation(CreationRequest creationDto);

    CreationResponse getCreationById(Long id);

    List<CreationResponse> getCreations();

    CreationResponse updateCreation(Long id, CreationRequest creationDto);

    ResponseEntity<String> deleteCreation(Long id);
}
