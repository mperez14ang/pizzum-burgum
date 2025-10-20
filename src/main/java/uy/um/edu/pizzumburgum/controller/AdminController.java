package uy.um.edu.pizzumburgum.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.request.AdminCreateRequest;
import uy.um.edu.pizzumburgum.dto.request.AdminUpdateRequest;
import uy.um.edu.pizzumburgum.dto.response.AdminResponse;
import uy.um.edu.pizzumburgum.services.AdminService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/v1")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping
    public ResponseEntity<AdminResponse> createAdmin(@RequestBody AdminCreateRequest adminCreateRequest) {
        AdminResponse created = adminService.createAdmin(adminCreateRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{email}")
    public ResponseEntity<AdminResponse> getAdminByEmail(@PathVariable String email) {
        return ResponseEntity.ok(adminService.getAdminByEmail(email));
    }

    @GetMapping
    public ResponseEntity<List<AdminResponse>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAdmins());
    }

    @PutMapping("/{email}")
    public ResponseEntity<AdminResponse> updateAdmin(
            @PathVariable String email,
            @RequestBody AdminUpdateRequest adminUpdateRequest) {
        return ResponseEntity.ok(adminService.updateAdmin(email, adminUpdateRequest));
    }

}