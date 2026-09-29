package com.nikkathebrand.backend.controller;

import com.nikkathebrand.backend.model.CarouselCard;
import com.nikkathebrand.backend.repository.CarouselCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/nikiadministradora/carousel")
@CrossOrigin(origins = "*")
public class AdminCarouselCardController {

    @Autowired
    private CarouselCardRepository carouselCardRepository;

    @GetMapping
    public ResponseEntity<List<CarouselCard>> getAllCarouselCards() {
        return ResponseEntity.ok(carouselCardRepository.findAllByOrderByDisplayOrderAsc());
    }

    @PostMapping
    public ResponseEntity<CarouselCard> createCarouselCard(@RequestBody CarouselCard carouselCard) {
        reorderCards(carouselCard, true);
        CarouselCard saved = carouselCardRepository.save(carouselCard);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarouselCard> updateCarouselCard(@PathVariable Long id, @RequestBody CarouselCard details) {
        Optional<CarouselCard> optionalCard = carouselCardRepository.findById(id);
        if (optionalCard.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CarouselCard existing = optionalCard.get();
        existing.setTitle(details.getTitle());
        existing.setImageUrl(details.getImageUrl());
        existing.setTargetUrl(details.getTargetUrl());
        existing.setDisplayOrder(details.getDisplayOrder());
        if (details.getIsActive() != null) {
            existing.setIsActive(details.getIsActive());
        }

        reorderCards(existing, false);
        CarouselCard updated = carouselCardRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarouselCard(@PathVariable Long id) {
        if (!carouselCardRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        carouselCardRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void reorderCards(CarouselCard targetCard, boolean isNew) {
        List<CarouselCard> allCards = carouselCardRepository.findAllByOrderByDisplayOrderAsc();
        if (!isNew) {
            allCards.removeIf(c -> c.getId().equals(targetCard.getId()));
        }

        int insertIndex = 0;
        for (int i = 0; i < allCards.size(); i++) {
            if (allCards.get(i).getDisplayOrder() >= targetCard.getDisplayOrder()) {
                insertIndex = i;
                break;
            }
            insertIndex = i + 1;
        }

        allCards.add(insertIndex, targetCard);

        for (int i = 0; i < allCards.size(); i++) {
            CarouselCard c = allCards.get(i);
            int expectedOrder = i + 1;
            if (c.getDisplayOrder() == null || c.getDisplayOrder() != expectedOrder) {
                c.setDisplayOrder(expectedOrder);
                if (c.getId() != null && !c.getId().equals(targetCard.getId())) {
                    carouselCardRepository.save(c);
                }
            }
        }
    }
}
