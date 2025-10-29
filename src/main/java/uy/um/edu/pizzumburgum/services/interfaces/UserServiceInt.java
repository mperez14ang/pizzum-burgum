package uy.um.edu.pizzumburgum.services.interfaces;

import uy.um.edu.pizzumburgum.dto.response.UserResponse;

import java.util.List;

public interface UserServiceInt {

    UserResponse getUserByEmail(String email);

    List<UserResponse> getUsers();
}
