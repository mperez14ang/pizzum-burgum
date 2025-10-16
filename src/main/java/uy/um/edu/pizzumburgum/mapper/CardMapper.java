package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.shared.CardDto;
import uy.um.edu.pizzumburgum.entities.Card;

public class CardMapper {

    public static CardDto toCardDto(Card card) {
        return CardDto.builder()
                .id(card.getId())
                .stripeId(card.getStripeId())
                .brand(card.getBrand())
                .last4Digits(card.getLast4Digits())
                .expirationYear(card.getExpirationYear())
                .expirationMonth(card.getExpirationMonth())
                .clientId(card.getClient() != null ? card.getClient().getEmail() : null)
                .build();
    }

    public static Card toCard(CardDto cardDto) {
        return Card.builder()
                .id(cardDto.getId())
                .stripeId(cardDto.getStripeId())
                .brand(cardDto.getBrand())
                .last4Digits(cardDto.getLast4Digits())
                .expirationYear(cardDto.getExpirationYear())
                .expirationMonth(cardDto.getExpirationMonth())
                .build();
    }
}
