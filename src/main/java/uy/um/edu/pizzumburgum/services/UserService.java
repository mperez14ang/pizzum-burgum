package uy.um.edu.pizzumburgum.services;

import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
