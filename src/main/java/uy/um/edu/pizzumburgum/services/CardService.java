package uy.um.edu.pizzumburgum.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentMethod;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.CardRequest;
import uy.um.edu.pizzumburgum.dto.response.CardResponse;
import uy.um.edu.pizzumburgum.entities.Card;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.mapper.CardMapper;
import uy.um.edu.pizzumburgum.repository.CardRepository;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.services.interfaces.CardServiceInt;

import java.util.ArrayList;
import java.util.List;

@Service
public class CardService implements CardServiceInt {

    @Autowired
    private final CardRepository cardRepository;

    private final ClientRepository clientRepository;

    String stripePrivateKey = Dotenv.load().get("PRIVATE_STRIPE_KEY");

    public CardService(CardRepository cardRepository, ClientRepository clientRepository) {
        this.cardRepository = cardRepository;
        this.clientRepository = clientRepository;
        if (stripePrivateKey != null) Stripe.apiKey = stripePrivateKey;
        else System.out.println("No se encontro PRIVATE_STRIPE_KEY, no se pueden realizar pagos");
    }

    @Override
    public CardResponse createCard(CardRequest cardRequest) {

        Card card = cardRepository.findByStripeId(cardRequest.getPaymentMethodId());
        if (card != null) return CardMapper.toCardResponse(card);

        Client client = clientRepository.findById(cardRequest.getClientEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "El cliente para la tarjeta no fue encontrado"
                ));

        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.retrieve(cardRequest.getPaymentMethodId());
        } catch (StripeException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, e.getMessage()
            );
        }

        card = CardMapper.toCard(paymentMethod, client);

        // Si es la primera tarjeta del usuario, se pone como default
        if (client.getCards() == null || client.getCards().isEmpty()) {
            card.setDefault(true);
        }

        cardRepository.save(card);
        return CardMapper.toCardResponse(card);
    }

    @Override
    public CardResponse getCardById(Long id) {
        return CardMapper.toCardResponse(
                cardRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "No se encontro una tarjeta con id " + id
                ))
        );
    }

    @Override
    public List<CardResponse> getCardsFromClient(String clientEmail) {
        Client client = clientRepository.findById(clientEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "No se encontro un cliente con id "  + clientEmail
                ));

        List<CardResponse> cards = new ArrayList<>();
        for (Card card : client.getCards()) {
            cards.add(this.getCardById(card.getId()));
        }
        return cards;
    }

    @Override
    public CardResponse updateCard(Long id, CardRequest cardRequest) {
        return null;
    }

    @Override
    public ResponseEntity<String> deleteCard(Long id) {
        return null;
    }
}
