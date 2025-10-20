package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.UserCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.UserUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.UserResponse;

import java.util.List;

public interface UserServiceInt {
    UserResponse createUser(UserCreateRequest userCreateRequest);

    UserResponse getUserByEmail(String email);

    List<UserResponse> getUsers();

    UserResponse updateUser(UserUpdateRequest userUpdateRequest);

    ResponseEntity<String> deleteUser(String email);
}
