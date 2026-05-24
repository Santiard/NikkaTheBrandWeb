package com.nikkathebrand.backend.controller;

import com.nikkathebrand.backend.model.Product;
import com.nikkathebrand.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // Habilitar CORS para integración con Frontend en Vite
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(@RequestParam(required = false) String category) {
        if (category != null && !category.trim().isEmpty()) {
            return ResponseEntity.ok(productRepository.findByCategoryAndActiveTrue(category.trim().toLowerCase()));
        }
        return ResponseEntity.ok(productRepository.findByActiveTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .filter(Product::getActive)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
