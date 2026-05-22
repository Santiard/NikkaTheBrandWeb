package com.nikkathebrand.backend.controller;

import com.nikkathebrand.backend.dto.LoginRequest;
import com.nikkathebrand.backend.model.AdminUser;
import com.nikkathebrand.backend.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<AdminUser> optionalAdmin = adminUserRepository.findByUsername(request.getUsername());

        if (optionalAdmin.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos.");
        }

        AdminUser admin = optionalAdmin.get();

        // Validar contraseña cifrada con BCrypt
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos.");
        }

        // Crear una respuesta de sesión exitosa sencilla
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login exitoso");
        response.put("username", admin.getUsername());
        response.put("email", admin.getEmail());
        response.put("role", admin.getRole());

        return ResponseEntity.ok(response);
    }
}
