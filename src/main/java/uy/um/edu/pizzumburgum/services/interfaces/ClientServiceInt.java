package uy.um.edu.pizzumburgum.services.interfaces;

import uy.um.edu.pizzumburgum.dto.ClientDto;
import uy.um.edu.pizzumburgum.exception.ResourceNotFoundException;

import java.util.List;

public interface ClientServiceInt {
    ClientDto createClient(ClientDto clientDto);

    ClientDto getClientById(Long id) throws ResourceNotFoundException;

    List<ClientDto> getClients();
}
