package com.nikkathebrand.backend.controller;

import com.nikkathebrand.backend.model.Product;
import com.nikkathebrand.backend.model.Promotion;
import com.nikkathebrand.backend.repository.PromotionRepository;
import com.nikkathebrand.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/nikiadministradora/promotions")
@CrossOrigin(origins = "*")
public class AdminPromotionController {

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return ResponseEntity.ok(promotionRepository.findAll());
    }

    @PostMapping
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        Promotion saved = promotionRepository.save(promotion);
        
        if (promotion.getProducts() != null) {
            for (Product p : promotion.getProducts()) {
                Optional<Product> optProduct = productRepository.findById(p.getId());
                if (optProduct.isPresent()) {
                    Product prod = optProduct.get();
                    prod.getPromotions().add(saved);
                    productRepository.save(prod);
                }
            }
        }
        
        Optional<Promotion> reloaded = promotionRepository.findById(saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(reloaded.orElse(saved));
    }

    @PutMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> updatePromotion(@PathVariable Long id, @RequestBody Promotion promotionDetails) {
        Optional<Promotion> optionalPromo = promotionRepository.findById(id);
        if (optionalPromo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Promotion existingPromo = optionalPromo.get();
        existingPromo.setName(promotionDetails.getName());
        existingPromo.setDiscountPercentage(promotionDetails.getDiscountPercentage());
        if (promotionDetails.getIsActive() != null) {
            existingPromo.setIsActive(promotionDetails.getIsActive());
        }

        Promotion updated = promotionRepository.save(existingPromo);

        if (promotionDetails.getProducts() != null) {
            java.util.Set<Long> targetProductIds = promotionDetails.getProducts().stream()
                .map(Product::getId)
                .collect(java.util.stream.Collectors.toSet());

            java.util.Set<Long> currentProductIds = existingPromo.getProducts().stream()
                .map(Product::getId)
                .collect(java.util.stream.Collectors.toSet());

            // 1. Remover promoción de los productos que ya no la tienen seleccionada
            java.util.List<Product> currentProductsCopy = new java.util.ArrayList<>(existingPromo.getProducts());
            for (Product prod : currentProductsCopy) {
                if (!targetProductIds.contains(prod.getId())) {
                    prod.getPromotions().removeIf(p -> p.getId().equals(id));
                    productRepository.save(prod);
                }
            }

            // 2. Agregar promoción a los nuevos productos seleccionados
            for (Long prodId : targetProductIds) {
                if (!currentProductIds.contains(prodId)) {
                    Optional<Product> optProduct = productRepository.findById(prodId);
                    if (optProduct.isPresent()) {
                        Product prod = optProduct.get();
                        prod.getPromotions().add(existingPromo);
                        productRepository.save(prod);
                    }
                }
            }
        }

        Optional<Promotion> reloaded = promotionRepository.findById(id);
        return ResponseEntity.ok(reloaded.orElse(updated));
    }

    @DeleteMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        Optional<Promotion> optionalPromo = promotionRepository.findById(id);
        if (optionalPromo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Promotion promo = optionalPromo.get();
        
        java.util.List<Product> currentProductsCopy = new java.util.ArrayList<>(promo.getProducts());
        for (Product prod : currentProductsCopy) {
            prod.getPromotions().removeIf(p -> p.getId().equals(id));
            productRepository.save(prod);
        }
        
        promotionRepository.delete(promo);
        return ResponseEntity.noContent().build();
    }
}
