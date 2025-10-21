package uy.um.edu.pizzumburgum.services.interfaces;

import com.stripe.model.PaymentMethod;
import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.response.CardResponse;

import java.util.List;

public interface CardServiceInt {
    CardResponse createCard(PaymentMethod paymentMethod, String clientId);

    CardResponse getCardById(Long id);

    List<CardResponse> getCardsFromClient(String clientEmail);

    CardResponse updateCard(Long id, PaymentMethod paymentMethod);

    ResponseEntity<String> deleteCard(Long id);
}
