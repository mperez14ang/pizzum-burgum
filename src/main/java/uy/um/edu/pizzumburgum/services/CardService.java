package uy.um.edu.pizzumburgum.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentMethod;
import com.stripe.param.PaymentMethodAttachParams;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.CardRequest;
import uy.um.edu.pizzumburgum.dto.response.CardResponse;
import uy.um.edu.pizzumburgum.entities.Card;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.entities.OrderBy;
import uy.um.edu.pizzumburgum.entities.OrderState;
import uy.um.edu.pizzumburgum.mapper.CardMapper;
import uy.um.edu.pizzumburgum.repository.CardRepository;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.services.interfaces.CardServiceInt;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CardService implements CardServiceInt {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final CardRepository cardRepository;

    private final ClientRepository clientRepository;

    @Value("${stripe.api.key}")
    String stripePrivateKey;

    @PostConstruct
    public void init(){
        if (stripePrivateKey != null) Stripe.apiKey = stripePrivateKey;
        else{
            logger.error("No se encontro PRIVATE_STRIPE_KEY, no se pueden realizar pagos");
        }
    }

    public CardService(CardRepository cardRepository, ClientRepository clientRepository) {
        this.cardRepository = cardRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    @Transactional
    public CardResponse createCard(CardRequest cardRequest) {
        // Verificar si la tarjeta ya existe
        Card existingCard = cardRepository.findByStripeId(cardRequest.getPaymentMethodId());
        if (existingCard != null) {
            existingCard.setDeleted(false);
            return CardMapper.toCardResponse(existingCard);
        }

        // Buscar el cliente
        Client client = clientRepository.findById(cardRequest.getClientEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No se encontró un cliente con email: " + cardRequest.getClientEmail()
                ));

        // Obtener el metodo de pago de Stripe
        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.retrieve(cardRequest.getPaymentMethodId());
        } catch (StripeException e) {
            logger.error("Error al recuperar el método de pago de Stripe: {}", e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al procesar el método de pago: " + e.getMessage()
            );
        }
        try {
            if (client.getStripeCustomerId() != null) {
                PaymentMethodAttachParams attachParams = PaymentMethodAttachParams.builder()
                        .setCustomer(client.getStripeCustomerId())
                        .build();

                paymentMethod = paymentMethod.attach(attachParams);
                logger.info("PaymentMethod {} adjuntado al customer {}",
                        paymentMethod.getId(), client.getStripeCustomerId());
            } else {
                logger.warn("Cliente {} no tiene stripeCustomerId", client.getEmail());
            }
        } catch (StripeException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "No se puede crear una tarjeta sin stripeCustomerId: " + e.getMessage()
            );
        }


        // Mapear a entidad Card
        Card card = CardMapper.toCard(paymentMethod, client);

        // Si es la primera tarjeta, establecer como predeterminada
        if (client.getCards().isEmpty()) {
            card.setActive(true);
        }

        // Relación bidireccional consistente
        card.setClient(client);
        client.getCards().add(card);

        // Guardar
        Card savedCard = cardRepository.save(card);

        return CardMapper.toCardResponse(savedCard);
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
    @Transactional
    public List<CardResponse> getCardsFromClient(String clientEmail) {
        Client client = clientRepository.findById(clientEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No se encontró un cliente con email: " + clientEmail
                ));

        logger.info(client.getCards().toString());

        return client.getCards().stream()
                .map(CardMapper::toCardResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CardResponse updateCard(Long id, CardRequest cardRequest) {
        return null;
    }

    @Transactional
    @Override
    public ResponseEntity<Map<String, Object>> deleteCard(Long id, String clientEmail) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarjeta no encontrada"));

        if (!card.getClient().getEmail().equals(clientEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,  "La tarjeta no pertenece a " + clientEmail
            );
        }

        // Desconectar la relación bidireccional
        Client client = card.getClient();
        if (client != null && client.getCards() != null) {
            client.getCards().remove(card);
            card.setClient(null);
        }

        card.setActive(false);
        card.setDeleted(true);

        if (!client.getCards().isEmpty()) {
            client.getCards().stream()
                    .filter(c -> !c.isDeleted())
                    .findFirst()
                    .ifPresent(c -> c.setActive(true));
        }

        cardRepository.delete(card);
        cardRepository.flush();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Tarjeta " + id + " fue borrada");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
