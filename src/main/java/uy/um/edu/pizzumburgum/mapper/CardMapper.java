package uy.um.edu.pizzumburgum.mapper;

import com.stripe.model.PaymentMethod;
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
                .build();
    }
}
