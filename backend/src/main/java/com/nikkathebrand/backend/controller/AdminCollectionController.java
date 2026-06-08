package com.nikkathebrand.backend.controller;

import com.nikkathebrand.backend.model.Collection;
import com.nikkathebrand.backend.model.Product;
import com.nikkathebrand.backend.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public ResponseEntity<Void> deleteCollection(@PathVariable Long id) {
        Collection collection = collectionRepository.findById(id).orElse(null);
        if (collection == null) {
            return ResponseEntity.notFound().build();
        }

        // Desasociar todos los productos vinculados antes de eliminar la colección
        if (collection.getProducts() != null) {
            for (Product product : collection.getProducts()) {
                product.setCollection(null);
            }
            collection.getProducts().clear();
        }

        collectionRepository.delete(collection);
        return ResponseEntity.noContent().build();
    }
}
