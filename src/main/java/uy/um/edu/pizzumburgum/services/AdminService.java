package uy.um.edu.pizzumburgum.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService implements AdminServiceInt {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AdminResponse createAdmin(AdminCreateRequest adminCreateRequest) {
        // Verificar si el email ya existe
        if (adminRepository.existsById(adminCreateRequest.getEmail())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Ya existe un administrador con el email: " + adminCreateRequest.getEmail()
            );
        }

        // Hashear la contraseña
        adminCreateRequest.setPassword(passwordEncoder.encode(adminCreateRequest.getPassword()));

        Admin admin = AdminMapper.toAdmin(adminCreateRequest);

        // Obtener el admin actual del contexto de seguridad
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Admin currentAdmin) {
            admin.setCreatedBy(currentAdmin);
        } else if (adminCreateRequest.getCreatedById() != null) {
            // Si se proporciona un ID, usarlo
            Admin createdBy = adminRepository.findById(adminCreateRequest.getCreatedById())
                    .orElse(null);
            admin.setCreatedBy(createdBy);
        }

        admin = adminRepository.save(admin);
        return AdminMapper.toAdminDtoResponse(admin);
    }

    @Override
    public AdminResponse getAdminByEmail(String email) {
        Admin admin = adminRepository.findById(email)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Administrador no encontrado con email: " + email
                ));
        return AdminMapper.toAdminDtoResponse(admin);
    }

    @Override
    public List<AdminResponse> getAdmins() {
        return adminRepository.findAll().stream()
                .map(AdminMapper::toAdminDtoResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AdminResponse updateAdmin(String adminEmail, AdminUpdateRequest adminUpdateRequest) {
        Admin admin = adminRepository.findById(adminEmail)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Administrador no encontrado con email: " + adminEmail
                ));

        // Actualizar campos
        if (adminUpdateRequest.getFirstName() != null) {
            admin.setFirstName(adminUpdateRequest.getFirstName());
        }
        if (adminUpdateRequest.getLastName() != null) {
            admin.setLastName(adminUpdateRequest.getLastName());
        }
        if (adminUpdateRequest.getBirthDate() != null) {
            admin.setBirthDate(adminUpdateRequest.getBirthDate());
        }
        if (adminUpdateRequest.getDni() != null) {
            admin.setDni(adminUpdateRequest.getDni());
        }

        admin = adminRepository.save(admin);
        return AdminMapper.toAdminDtoResponse(admin);
    }

    @Override
    public ResponseEntity<String> deleteClient(String email) {
        if (!adminRepository.existsById(email)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Administrador no encontrado con email: " + email
            );
        }
        adminRepository.deleteById(email);
        return ResponseEntity.ok("Administrador eliminado correctamente");
    }
}

