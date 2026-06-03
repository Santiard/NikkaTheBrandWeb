package com.nikkathebrand.backend.controller;

import com.nikkathebrand.backend.model.Promotion;
import com.nikkathebrand.backend.repository.PromotionRepository;
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

    @GetMapping
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return ResponseEntity.ok(promotionRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        Promotion saved = promotionRepository.save(promotion);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
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
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        if (!promotionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        promotionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
