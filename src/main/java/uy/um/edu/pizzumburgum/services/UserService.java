package uy.um.edu.pizzumburgum.services;

import uy.um.edu.pizzumburgum.entities.User;
import uy.um.edu.pizzumburgum.repository.UserRepository;

import java.util.Optional;

public class UserService {
    public UserRepository userRepository;

    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }
}
