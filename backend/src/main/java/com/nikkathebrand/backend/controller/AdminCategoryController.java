package com.nikkathebrand.backend.controller;

import com.nikkathebrand.backend.model.Category;
import com.nikkathebrand.backend.model.Product;
import com.nikkathebrand.backend.repository.CategoryRepository;
import com.nikkathebrand.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nikiadministradora/categories")
@CrossOrigin(origins = "*")
public class AdminCategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre de la categoría no puede estar vacío.");
        }
        
        String cleanName = category.getName().trim().toLowerCase();
        if (categoryRepository.findByName(cleanName).isPresent()) {
            return ResponseEntity.badRequest().body("Ya existe una categoría con ese nombre.");
        }

        category.setName(cleanName);
        Category saved = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            return ResponseEntity.notFound().build();
        }

        // Validar si existen productos asociados
        List<Product> products = productRepository.findByCategory(category.getName());
        if (!products.isEmpty()) {
            return ResponseEntity.badRequest().body("No se puede eliminar la categoría porque hay productos asociados a ella. Reasigna los productos primero.");
        }

        categoryRepository.delete(category);
        return ResponseEntity.noContent().build();
    }
}
