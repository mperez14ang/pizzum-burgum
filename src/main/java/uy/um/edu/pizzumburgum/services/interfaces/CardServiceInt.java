package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.CardRequest;
import uy.um.edu.pizzumburgum.dto.response.CardResponse;

import java.util.List;

public interface CardServiceInt {
    CardResponse createCard(CardRequest cardRequest);

    CardResponse getCardById(Long id);

    List<CardResponse> getCardsFromClient(String clientEmail);

    CardResponse updateCard(Long id, CardRequest cardRequest);

    ResponseEntity<String> deleteCard(Long id);
}
