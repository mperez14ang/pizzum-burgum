package uy.um.edu.pizzumburgum.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import uy.um.edu.pizzumburgum.dto.response.AvatarResponse;
import uy.um.edu.pizzumburgum.services.UserService;

@Controller
@RequestMapping("api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("{userEmail}/avatar")
    public ResponseEntity<AvatarResponse> getUserAvatar(@PathVariable String userEmail) {
        return new ResponseEntity<>(userService.getUserAvatar(userEmail), HttpStatus.OK);
    }

    @PostMapping("{userEmail}/avatar")
    public ResponseEntity<AvatarResponse> randomizeUserAvatar(@PathVariable String userEmail) {
        return new ResponseEntity<>(userService.randomizeUserAvatar(userEmail), HttpStatus.OK);
    }

}
