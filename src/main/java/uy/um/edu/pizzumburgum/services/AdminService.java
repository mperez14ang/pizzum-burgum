package uy.um.edu.pizzumburgum.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.AdminCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.AdminUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.AdminResponse;
import uy.um.edu.pizzumburgum.entities.Admin;
import uy.um.edu.pizzumburgum.mapper.AdminMapper;
import uy.um.edu.pizzumburgum.repository.AdminRepository;
import uy.um.edu.pizzumburgum.services.interfaces.AdminServiceInt;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService implements AdminServiceInt {
    AdminRepository adminRepository;

    @Override
    public AdminResponse createAdmin(AdminCreateRequest adminCreateRequest) {
        Admin admin = AdminMapper.toAdmin(adminCreateRequest);
        admin.setCreatedBy(
                adminRepository.findById(adminCreateRequest.getCreatedById())
                        .orElseThrow( () -> new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST, "No se puede encontrar el admin que creo a " +  adminCreateRequest.getEmail()
                                )
                        )
        );
        adminRepository.save(admin);
        return AdminMapper.toAdminDtoResponse(admin);
    }

    @Override
    public AdminResponse getAdminByEmail(String email) {
        return null;
    }

    @Override
    public List<AdminResponse> getAdmins() {
        return List.of();
    }

    @Override
    public AdminResponse updateAdmin(String adminEmail, AdminUpdateRequest adminUpdateRequest) {
        return null;
    }

    @Override
    public ResponseEntity<String> deleteClient(String email) {
        return null;
    }
}

