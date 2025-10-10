package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uy.um.edu.pizzumburgum.entities.Card;

public interface CardRepository extends JpaRepository<Card,Long> {
}
