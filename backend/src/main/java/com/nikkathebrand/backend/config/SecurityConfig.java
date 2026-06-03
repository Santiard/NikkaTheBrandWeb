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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Define la configuración de CORS explícita para resolver bloqueos pre-flight (OPTIONS)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Permitir explícitamente el origen de desarrollo del frontend (React Vite)
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        config.setAllowCredentials(true); // Requerido para Basic Auth
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Habilitar CORS con nuestra configuración personalizada y deshabilitar CSRF para APIs REST
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            
            // Reglas de Autorización de Endpoints
            .authorizeHttpRequests(auth -> auth
                // Permitir todas las solicitudes pre-flight de CORS (OPTIONS) sin autenticar
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Acceso público a las APIs del Catálogo y del Carrito de clientes
                .requestMatchers(HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/collections", "/api/collections/**").permitAll()
                .requestMatchers("/api/orders/checkout").permitAll()
                
                // Acceso libre a la consola de H2 para desarrollo
                .requestMatchers("/h2-console/**").permitAll()
                
                // Endpoints de autenticación libres
                .requestMatchers("/api/auth/**").permitAll()
                
                // Proteger todas las rutas administrativas bajo el atajo exclusivo /api/nikiadministradora/**
                .requestMatchers("/api/nikiadministradora/**").hasRole("ADMIN")
                
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
