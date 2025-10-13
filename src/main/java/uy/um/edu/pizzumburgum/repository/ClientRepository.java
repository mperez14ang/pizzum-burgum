package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uy.um.edu.pizzumburgum.entities.Client;

public interface ClientRepository extends JpaRepository<Client, String> {
}
