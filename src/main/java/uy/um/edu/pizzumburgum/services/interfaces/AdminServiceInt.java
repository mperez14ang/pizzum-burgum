package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.AdminCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.AdminUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.AdminResponse;

import java.util.List;

public interface AdminServiceInt {
    AdminResponse createAdmin(AdminCreateRequest adminCreateRequest);

    AdminResponse createAdmin(AdminCreateRequest adminCreateRequest, boolean validateDni);

    AdminResponse getAdminByEmail(String email);

    List<AdminResponse> getAdmins();

    AdminResponse updateAdmin(String adminEmail, AdminUpdateRequest adminUpdateRequest);

    ResponseEntity<String> deleteClient(String email);
}
