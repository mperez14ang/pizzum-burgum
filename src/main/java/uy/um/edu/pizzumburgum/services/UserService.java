package uy.um.edu.pizzumburgum.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.request.ClientUpdateRequest;
import uy.um.edu.pizzumburgum.dto.request.UserCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.UserUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.UserDtoResponse;
import uy.um.edu.pizzumburgum.repository.UserRepository;
import uy.um.edu.pizzumburgum.services.interfaces.UserServiceInt;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserServiceInt {

    private final UserRepository userRepository;

    @Override
    public UserDtoResponse createUser(UserCreateRequest userCreateRequest) {
        return null;
    }

    @Override
    public UserDtoResponse getUserByEmail(String email) {
        return null;
    }

    @Override
    public List<UserDtoResponse> getUsers() {
        return List.of();
    }

    @Override
    public UserDtoResponse updateUser(UserUpdateRequest userUpdateRequest) {
        return null;
    }

    @Override
    public ResponseEntity<String> deleteUser(String email) {
        return null;
    }
}
