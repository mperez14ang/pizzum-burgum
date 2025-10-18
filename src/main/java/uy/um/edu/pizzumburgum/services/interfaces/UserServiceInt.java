package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.UserCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.UserUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.UserDtoResponse;

import java.util.List;

public interface UserServiceInt {
    UserDtoResponse createUser(UserCreateRequest userCreateRequest);

    UserDtoResponse getUserByEmail(String email);

    List<UserDtoResponse> getUsers();

    UserDtoResponse updateUser(UserUpdateRequest userUpdateRequest);

    ResponseEntity<String> deleteUser(String email);
}
