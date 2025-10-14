package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uy.um.edu.pizzumburgum.entities.Admin;

public interface AdminRepository extends JpaRepository<Admin, String> {
}
