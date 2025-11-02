package uy.um.edu.pizzumburgum.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.request.CardRequest;
import uy.um.edu.pizzumburgum.dto.response.CardResponse;
import uy.um.edu.pizzumburgum.services.AuthService;
import uy.um.edu.pizzumburgum.services.CardService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/card/v1")
public class CardController {
    private final CardService cardService;

    private final AuthService authService;

    public CardController(CardService cardService, AuthService authService) {
        this.cardService = cardService;
        this.authService = authService;
    }

    @PostMapping
    public CardResponse createCard(@RequestBody CardRequest cardRequest) {
        return this.cardService.createCard(cardRequest);
    }

    @GetMapping("my")
    public List<CardResponse> getClientCards(HttpServletRequest httpRequest){
        String clientEmail = authService.getUserEmail(httpRequest);
        return this.cardService.getCardsFromClient(clientEmail);
    }

    @GetMapping("{id}")
    public CardResponse getCard(@PathVariable Long id) {
        return this.cardService.getCardById(id);
    }

    @PutMapping
    public CardResponse updateCard(Long id, CardRequest cardRequest) {
        return this.cardService.updateCard(id, cardRequest);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Map<String, Object>> deleteCard(HttpServletRequest httpRequest, @PathVariable Long id){
        String clientEmail = authService.getUserEmail(httpRequest);
        return cardService.deleteCard(id, clientEmail);
    }
}
