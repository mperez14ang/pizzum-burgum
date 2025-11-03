package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.CardRequest;
import uy.um.edu.pizzumburgum.dto.response.CardResponse;

import java.util.List;
import java.util.Map;

public interface CardServiceInt {
    ResponseEntity<CardResponse> createCard(CardRequest cardRequest);

    ResponseEntity<CardResponse> getCardById(Long id);

    List<CardResponse> getCardsFromClient(String clientEmail);

    ResponseEntity<CardResponse> updateCard(Long id, CardRequest cardRequest);

    ResponseEntity<Map<String, Object>> deleteCard(Long id, String clientEmail);
}
