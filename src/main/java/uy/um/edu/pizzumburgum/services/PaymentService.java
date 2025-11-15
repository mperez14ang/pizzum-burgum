package uy.um.edu.pizzumburgum.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.entities.Card;
import uy.um.edu.pizzumburgum.entities.Client;
import uy.um.edu.pizzumburgum.repository.CardRepository;
import uy.um.edu.pizzumburgum.repository.ClientRepository;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${stripe.api.key}")
    private String stripePrivateKey;

    private final CardRepository cardRepository;
    private final ClientRepository clientRepository;

    @PostConstruct
    public void init(){
        if (stripePrivateKey != null) Stripe.apiKey = stripePrivateKey;
        else{
            logger.error("No se encontro PRIVATE_STRIPE_KEY, no se pueden realizar pagos");
        }
    }

    public PaymentService(CardRepository cardRepository, ClientRepository clientRepository) {
        this.cardRepository = cardRepository;
        this.clientRepository = clientRepository;
    }

    public Map<String, Object> createPaymentIntent(
            String clientEmail,
            Long cardId,
            BigDecimal amount,
            String currency,
            String description
    ) {
        // Verificar que el cliente existe
        Client client = clientRepository.findById(clientEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cliente no encontrado: " + clientEmail
                ));

        // Buscar la tarjeta
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tarjeta no encontrada: " + cardId
                ));

        // Verificar que la tarjeta pertenece al cliente
        if (!card.getClient().getEmail().equals(clientEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "La tarjeta no pertenece al cliente"
            );
        }

        // Verificar que la tarjeta no está eliminada
        if (card.isDeleted()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "La tarjeta está eliminada"
            );
        }

        // Verificar que la tarjeta no está vencida
        if (card.isExpired()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "La tarjeta está vencida"
            );
        }

        try {
            // Ver si es dolares o pesos, pero siempre convertir el monto a la unidad minima (como centavos en este caso)
            long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(currency.toLowerCase())
                    .setCustomer(client.getStripeCustomerId())
                    .setPaymentMethod(card.getStripeId())
                    .setConfirm(true)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .setAllowRedirects(PaymentIntentCreateParams.AutomaticPaymentMethods.AllowRedirects.NEVER)
                                    .build()
                    )
                    .setDescription(description)
                    .putMetadata("client_email", clientEmail)
                    .putMetadata("card_id", cardId.toString())
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            logger.info("PaymentIntent creado: {} - Estado: {}", paymentIntent.getId(), paymentIntent.getStatus());

            Map<String, Object> response = new HashMap<>();
            response.put("paymentIntentId", paymentIntent.getId());
            response.put("status", paymentIntent.getStatus());
            response.put("amount", amount);
            response.put("currency", currency);
            response.put("clientSecret", paymentIntent.getClientSecret());

            return response;

        } catch (StripeException e) {
            logger.error("Error al crear PaymentIntent: {}", e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al procesar el pago: " + e.getUserMessage()
            );
        }
    }

    public Map<String, Object> getPaymentStatus(String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

            Map<String, Object> response = new HashMap<>();
            response.put("paymentIntentId", paymentIntent.getId());
            response.put("status", paymentIntent.getStatus());
            response.put("amount", paymentIntent.getAmount() / 100.0);
            response.put("currency", paymentIntent.getCurrency());

            return response;

        } catch (StripeException e) {
            logger.error("Error al obtener estado del pago: {}", e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al obtener el estado del pago"
            );
        }
    }
}