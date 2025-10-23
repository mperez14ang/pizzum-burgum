package uy.um.edu.pizzumburgum.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.shared.CreationDto;
import uy.um.edu.pizzumburgum.services.ClientService;
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
    public CreationDto createCreation(@RequestBody CreationDto creationDto) {
        return creationService.createCreation(creationDto);
    }

    @GetMapping("{id}")
    public CreationDto getCreation(@PathVariable Long id) {
        return creationService.getCreationById(id);
    }

    @GetMapping
    public List<CreationDto> getCreations() {
        return creationService.getCreations();
    }
}
