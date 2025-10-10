package uy.um.edu.pizzumburgum.services;

import uy.um.edu.pizzumburgum.entities.User;
import uy.um.edu.pizzumburgum.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }
}
