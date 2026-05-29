package com.nikkathebrand.backend.controller;

import com.nikkathebrand.backend.model.Collection;
import com.nikkathebrand.backend.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nikiadministradora/collections")
@CrossOrigin(origins = "*")
public class AdminCollectionController {

    @Autowired
    private CollectionRepository collectionRepository;

    @PostMapping
    public ResponseEntity<Collection> createCollection(@RequestBody Collection collection) {
        Collection saved = collectionRepository.save(collection);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long id) {
        if (!collectionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        collectionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
