package uy.um.edu.pizzumburgum.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.response.AddressResponse;
import uy.um.edu.pizzumburgum.services.AddressService;
import uy.um.edu.pizzumburgum.services.AuthService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final AddressService addressService;
    private final AuthService authService;

    @Autowired
    public AddressController(AddressService addressService, AuthService authService) {
        this.addressService = addressService;
        this.authService = authService;
    }

    @GetMapping("{id}")
    public ResponseEntity<AddressResponse> getAddress(@PathVariable Long id){
        return new ResponseEntity<>(addressService.getAddress(id), HttpStatus.OK);
    }

    @GetMapping("/my")
    public ResponseEntity<List<AddressResponse>> getClientAddresses(HttpServletRequest request){
        String clientEmail = authService.getUserEmail(request);
        return new ResponseEntity<>(addressService.getClientAddresses(clientEmail), HttpStatus.OK) ;
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Map<String, Object>> deleteAddress(HttpServletRequest request, @PathVariable Long id){
        String clientEmail = authService.getUserEmail(request);
        return new ResponseEntity<>(addressService.deleteAddress(clientEmail, id), HttpStatus.OK);
    }

}
