package uy.um.edu.pizzumburgum.services.interfaces;

import org.springframework.http.ResponseEntity;
import uy.um.edu.pizzumburgum.dto.request.AdminCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.AdminUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.AdminDtoResponse;

import java.util.List;

public interface AdminServiceInt {
    AdminDtoResponse createAdmin(AdminCreateRequest adminCreateRequest);

    AdminDtoResponse getAdminByEmail(String email);

    List<AdminDtoResponse> getAdmins();

    AdminDtoResponse updateAdmin(String adminEmail, AdminUpdateRequest adminUpdateRequest);

    ResponseEntity<String> deleteClient(String email);
}
