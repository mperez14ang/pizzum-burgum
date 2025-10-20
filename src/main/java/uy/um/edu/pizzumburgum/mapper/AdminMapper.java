package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.request.AdminCreateRequest;
import uy.um.edu.pizzumburgum.dto.response.AdminResponse;
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
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .build();
    }

    // Admin Entity -> Admin Response
    public static AdminResponse toAdminDtoResponse(Admin admin) {

        return AdminResponse.builder()
                .email(admin.getEmail())
                .firstName(admin.getFirstName())
                .lastName(admin.getLastName())
                .createdById(admin.getEmail())
                .birthDate(admin.getBirthDate())
                .userType(admin.getUserType())
                .build();
    }
}
