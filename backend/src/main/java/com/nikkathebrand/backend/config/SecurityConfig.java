package com.nikkathebrand.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Habilitar CORS y deshabilitar CSRF para APIs REST sin estado
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            
            // Reglas de Autorización de Endpoints
            .authorizeHttpRequests(auth -> auth
                // Acceso público a las APIs del Catálogo y del Carrito de clientes
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/collections/**").permitAll()
                .requestMatchers("/api/orders/checkout").permitAll()
                
                // Acceso libre a la consola de H2 para desarrollo
                .requestMatchers("/h2-console/**").permitAll()
                
                // Endpoints de autenticación libres
                .requestMatchers("/api/auth/**").permitAll()
                
                // Proteger todas las rutas administrativas
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Cualquier otra petición debe estar autenticada
                .anyRequest().authenticated()
            )
            
            // Permitir que la consola H2 se muestre dentro de un iframe desactivando frameOptions
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            
            // Habilitar autenticación básica HTTP para endpoints protegidos
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
