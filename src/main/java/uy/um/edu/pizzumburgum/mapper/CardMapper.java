package uy.um.edu.pizzumburgum.mapper;

import com.stripe.model.PaymentMethod;
import uy.um.edu.pizzumburgum.dto.response.CardOwnerResponse;
import uy.um.edu.pizzumburgum.dto.response.CardResponse;
import uy.um.edu.pizzumburgum.entities.Card;
import uy.um.edu.pizzumburgum.entities.Client;

public class CardMapper {

    // From stripe's PaymentMethod -> Card
    public static Card toCard(PaymentMethod paymentMethod, Client client) {
        PaymentMethod.Card cardData = paymentMethod.getCard();

        return Card.builder()
                .brand(cardData.getBrand())
                .stripeId(paymentMethod.getId())
                .client(client)
                .expirationMonth(cardData.getExpMonth())
                .expirationYear(cardData.getExpYear())
                .last4Digits(cardData.getLast4())
                .country(cardData.getCountry())
                .funding(cardData.getFunding())
                .fingerprint(cardData.getFingerprint())
                .deleted(false)
                .build();
    }

    // From Card -> CardResponse
    public static CardResponse toCardResponse(Card card) {
        return CardResponse.builder()
                .id(card.getId())
                .brand(card.getBrand())
                .protectedNumber(card.getCardProtectedNumber())
                .expirationYear(card.getExpirationYear())
                .expirationMonth(card.getExpirationMonth())
                .clientId(card.getClient().getEmail())
                .active(card.isActive())
                .deleted(card.isDeleted())
                .build();
    }

    // From Card -> CardOwnerResponse (incluye datos del cliente)
    public static CardOwnerResponse toCardOwnerResponse(Card card) {
        Client client = card.getClient();
        return CardOwnerResponse.builder()
                .clientEmail(client.getEmail())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .dni(client.getDni())
                .birthDate(client.getBirthDate())
                .build();
    }
}
