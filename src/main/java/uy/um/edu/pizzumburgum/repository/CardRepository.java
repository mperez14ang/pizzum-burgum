package uy.um.edu.pizzumburgum.repository;

import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import uy.um.edu.pizzumburgum.entities.Card;

public interface CardRepository extends JpaRepositoryImplementation<Card,Long> {
}
