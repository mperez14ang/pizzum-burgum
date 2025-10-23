package uy.um.edu.pizzumburgum.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.request.CardRequest;
import uy.um.edu.pizzumburgum.dto.response.CardResponse;
import uy.um.edu.pizzumburgum.services.CardService;

import java.util.Map;

@RestController
@RequestMapping("/api/card/v1")
public class CardController {
    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @PostMapping
    public CardResponse createCard(@RequestBody CardRequest cardRequest) {
        return this.cardService.createCard(cardRequest);
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
    public ResponseEntity<Map<String, Object>> deleteCard(@PathVariable Long id){
        return cardService.deleteCard(id);
    }
}
