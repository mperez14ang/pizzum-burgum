package uy.um.edu.pizzumburgum.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.request.CreationRequest;
import uy.um.edu.pizzumburgum.dto.response.CreationResponse;
import uy.um.edu.pizzumburgum.services.CreationService;

import java.util.List;

@RestController
@RequestMapping("/api/creation/v1")
public class CreationController {
    private final CreationService creationService;

    public CreationController(CreationService creationService) {
        this.creationService = creationService;
    }

    @PostMapping
    public CreationResponse createCreation(@RequestBody CreationRequest creationDto) {
        return creationService.createCreation(creationDto);
    }

    @GetMapping("{id}")
    public CreationResponse getCreation(@PathVariable Long id) {
        return creationService.getCreationById(id);
    }

    @GetMapping
    public List<CreationResponse> getCreations() {
        return creationService.getCreations();
    }

    @DeleteMapping
    public ResponseEntity<String> deleteCreation(Long id) {
        return creationService.deleteCreation(id);
    }
}
