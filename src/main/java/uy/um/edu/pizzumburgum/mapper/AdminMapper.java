package uy.um.edu.pizzumburgum.mapper;

import uy.um.edu.pizzumburgum.dto.request.AdminCreateRequest;
import uy.um.edu.pizzumburgum.entities.Admin;
import uy.um.edu.pizzumburgum.repository.AdminRepository;

import java.util.Optional;

public class AdminMapper {

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

    public static AdminCreateRequest toAdminDto(Admin admin) {
        AdminCreateRequest adminCreateRequest = AdminCreateRequest.builder()
                .email(admin.getEmail())
                .dni(admin.getDni())
                .username(admin.getUsername())
                .lastName(admin.getLastName())
                .createdById(null)
                .birthDate(admin.getBirthDate())
                .password(admin.getPassword())
                .build();

        if (admin.getCreatedBy() != null) adminCreateRequest.setCreatedById(admin.getCreatedBy().getEmail());

        return adminCreateRequest;
    }
}
