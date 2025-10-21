package uy.um.edu.pizzumburgum.services;

import com.stripe.model.PaymentMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.response.CardResponse;
import uy.um.edu.pizzumburgum.entities.Card;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.mapper.CardMapper;
import uy.um.edu.pizzumburgum.repository.CardRepository;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.services.interfaces.CardServiceInt;

import java.util.List;

@Service
public class CardService implements CardServiceInt {

    @Autowired
    private final CardRepository cardRepository;

    private final ClientRepository clientRepository;

    public CardService(CardRepository cardRepository, ClientRepository clientRepository) {
        this.cardRepository = cardRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public CardResponse createCard(PaymentMethod paymentMethod, String clientId) {

        Card card = cardRepository.findByStripeId(paymentMethod.getId());
        if (card != null) return CardMapper.toCardResponse(card);

        Client client = clientRepository.findById(clientId)
                .orElseThrow();

        card = CardMapper.toCard(paymentMethod, client);

        cardRepository.save(card);
        return CardMapper.toCardResponse(card);
    }

    @Override
    public CardResponse getCardById(Long id) {
        return null;
    }

    @Override
    public List<CardResponse> getCardsFromClient(String clientEmail) {
        return List.of();
    }

    @Override
    public CardResponse updateCard(Long id, PaymentMethod paymentMethod) {
        return null;
    }

    @Override
    public ResponseEntity<String> deleteCard(Long id) {
        return null;
    }
}
