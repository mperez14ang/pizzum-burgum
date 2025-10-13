package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uy.um.edu.pizzumburgum.entities.User;

public interface UserRepository extends JpaRepository<User, String> {
}
