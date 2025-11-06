package uy.um.edu.pizzumburgum.services;

import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.response.AvatarResponse;
import uy.um.edu.pizzumburgum.entities.User;
import uy.um.edu.pizzumburgum.repository.UserRepository;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    private static final String DICE_BEAR_URL = "https://api.dicebear.com/9.x";

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AvatarResponse getUserAvatar(String userEmail) {
        User user = userRepository.getReferenceById(userEmail);

        if (user.getAvatarSeed() == null || user.getAvatarSeed().isEmpty()) {
            return this.randomizeUserAvatar(user);
        }

        return AvatarResponse.builder()
                .userEmail(user.getEmail())
                .profileUrl(getAvatarUrl(user))
                .build();
    }

    public AvatarResponse randomizeUserAvatar(String userEmail) {
        User user = userRepository.getReferenceById(userEmail);
        return this.randomizeUserAvatar(user);
    }

    private AvatarResponse randomizeUserAvatar(User user) {
        user.setAvatarSeed(this.calculateAvatarSeed(user));
        userRepository.save(user);
        return AvatarResponse.builder()
                .userEmail(user.getEmail())
                .profileUrl(getAvatarUrl(user))
                .build();
    }

    private String calculateAvatarSeed(User user) {
        String randomSuffix = UUID.randomUUID().toString().substring(0, 8);
        return (user.getEmail() + user.getFirstName() + user.getLastName() + randomSuffix).toLowerCase();
    }

    public static String getAvatarUrl(User user){
        return String.format("%s/%s/svg?seed=%s", DICE_BEAR_URL, "avataaars", user.getAvatarSeed());
    }

}
