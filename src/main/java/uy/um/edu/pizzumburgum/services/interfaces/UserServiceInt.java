package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.ClientCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.ClientUpdateRequest;
import uy.um.edu.pizzumburgum.dto.request.UserCreateRequest;
import uy.um.edu.pizzumburgum.dto.response.ClientDtoResponse;
import uy.um.edu.pizzumburgum.dto.response.UserDtoResponse;

import java.util.List;

public interface UserServiceInt {
    UserDtoResponse createUser(UserCreateRequest clientCreateRequest);

    UserDtoResponse getUserByEmail(String email);

    List<UserDtoResponse> getUsers();

    UserDtoResponse updateUser(String clientEmail, ClientUpdateRequest clientUpdateRequest);

    ResponseEntity<String> deleteUser(String email);
}
