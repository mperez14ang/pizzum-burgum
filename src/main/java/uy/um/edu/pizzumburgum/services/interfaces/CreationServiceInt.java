package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.ClientDtoResponse;
import uy.um.edu.pizzumburgum.dto.shared.CreationDto;

import java.util.List;

public interface CreationServiceInt {
    CreationDto createCreation(CreationDto creationDto);

    CreationDto getCreationById(Long id);

    List<CreationDto> getCreations();

    CreationDto updateCreation(Long id, CreationDto creationDto);

    ResponseEntity<String> deleteCreation(Long id);
}
