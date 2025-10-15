package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.CardDto;
import uy.um.edu.pizzumburgum.entities.Card;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.repository.ClientRepository;

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

    public static Card toCard(CardDto cardDto, ClientRepository clientRepository) {
        Client client = null;
        if (cardDto.getClientId() != null) {
            client = clientRepository.findById(cardDto.getClientId())
                    .orElseThrow(() -> new RuntimeException("No se encontro el cliente"));
        }

        return Card.builder()
                .id(cardDto.getId())
                .stripeId(cardDto.getStripeId())
                .brand(cardDto.getBrand())
                .last4Digits(cardDto.getLast4Digits())
                .expirationYear(cardDto.getExpirationYear())
                .expirationMonth(cardDto.getExpirationMonth())
                .client(client)
                .build();
    }
}
