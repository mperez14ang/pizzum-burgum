package uy.um.edu.pizzumburgum.services;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.shared.CardDto;
import uy.um.edu.pizzumburgum.services.interfaces.CardServiceInt;

import java.util.List;

public class CardService implements CardServiceInt {
    @Override
    public CardDto createCard(CardDto cardDto) {
        return null;
    }

    @Override
    public CardDto getCardById(Long id) {
        return null;
    }

    @Override
    public List<CardDto> getCardsFromClient(String clientEmail) {
        return List.of();
    }

    @Override
    public CardDto updateCard(Long id, CardDto cardDto) {
        return null;
    }

    @Override
    public ResponseEntity<String> deleteCard(Long id) {
        return null;
    }
}
