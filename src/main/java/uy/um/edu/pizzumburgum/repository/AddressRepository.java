package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uy.um.edu.pizzumburgum.entities.Address;

public interface AddressRepository extends JpaRepository<Address,Long> {
    // Encuentra una direccion activa
    public Address findByClientEmailAndActiveTrueAndDeletedFalse(String clientEmail);

}
