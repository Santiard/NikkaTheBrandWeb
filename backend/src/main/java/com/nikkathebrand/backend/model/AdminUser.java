package com.nikkathebrand.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin_users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password; // Hash BCrypt seguro

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String role = "ADMIN"; // Default ADMIN
}
