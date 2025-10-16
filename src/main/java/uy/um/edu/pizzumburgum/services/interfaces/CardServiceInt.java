package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.shared.CardDto;

import java.util.List;

public interface CardServiceInt {
    CardDto createCard(CardDto cardDto);

    CardDto getCardById(Long id);

    List<CardDto> getCardsFromClient(String clientEmail);

    CardDto updateCard(Long id, CardDto cardDto);

    ResponseEntity<String> deleteCard(Long id);
}
