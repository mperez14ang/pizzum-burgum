package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.request.AdminCreateRequest;
import uy.um.edu.pizzumburgum.dto.response.AdminDtoResponse;
import uy.um.edu.pizzumburgum.entities.Admin;

public class AdminMapper {

    // Admin Request -> Admin Entity
    public static Admin toAdmin(AdminCreateRequest dto) {
        return Admin.builder()
                .email(dto.getEmail())
                .dni(dto.getDni())
                .createdBy(null)
                .birthDate(dto.getBirthDate())
                .password(dto.getPassword())
                .username(dto.getUsername())
                .lastName(dto.getLastName())
                .build();
    }

    // Admin Entity -> Admin Response
    public static AdminDtoResponse toAdminDtoResponse(Admin admin) {
        AdminDtoResponse adminDtoResponse = AdminDtoResponse.builder()
                .email(admin.getEmail())
                .username(admin.getUsername())
                .lastName(admin.getLastName())
                .createdById(admin.getEmail())
                .birthDate(admin.getBirthDate())
                .build();

        return adminDtoResponse;
    }
}
