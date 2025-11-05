package uy.um.edu.pizzumburgum.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<CardResponse> createCard(@RequestBody CardRequest cardRequest) {
        return new ResponseEntity<>(cardService.createCard(cardRequest), HttpStatus.OK);
    }

    @GetMapping("my")
    public ResponseEntity<List<CardResponse>> getClientCards(HttpServletRequest httpRequest){
        String clientEmail = authService.getUserEmail(httpRequest);
        return new ResponseEntity<>(cardService.getCardsFromClient(clientEmail), HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<CardResponse> getCard(@PathVariable Long id) {
        return new ResponseEntity<>(cardService.getCardById(id), HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<CardResponse> updateCard(@PathVariable Long id, @RequestBody CardRequest cardRequest) {
        return new ResponseEntity<>(cardService.updateCard(id, cardRequest), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Map<String, Object>> deleteCard(HttpServletRequest httpRequest, @PathVariable Long id){
        String clientEmail = authService.getUserEmail(httpRequest);
        return new ResponseEntity<>(cardService.deleteCard(id, clientEmail), HttpStatus.OK);
    }

    @PatchMapping("{id}/active")
    public ResponseEntity<CardResponse> setCardAsActive(HttpServletRequest httpServletRequest, @PathVariable Long id){
        String clientEmail = authService.getUserEmail(httpServletRequest);
        return new ResponseEntity<>(cardService.setCardAsActive(id, clientEmail), HttpStatus.OK);
    }
}
