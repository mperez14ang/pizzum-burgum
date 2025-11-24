package uy.um.edu.pizzumburgum.services.interfaces;

import jakarta.transaction.Transactional;
import uy.um.edu.pizzumburgum.dto.request.CardRequest;
import uy.um.edu.pizzumburgum.dto.response.CardResponse;
import uy.um.edu.pizzumburgum.entities.Client;

import java.util.List;
import java.util.Map;

public interface CardServiceInt {
    CardResponse createCard(CardRequest cardRequest, String clientEmail);

    @Transactional
    CardResponse createCard(CardRequest cardRequest, String clientEmail, Client client);

    CardResponse getCardById(Long id);

    List<CardResponse> getCardsFromClient(String clientEmail);

    CardResponse updateCard(Long id, CardRequest cardRequest, String clientEmail);

    Map<String, Object> deleteCard(Long id, String clientEmail);

    CardResponse setCardAsActive(Long id, String clientEmail);
}
