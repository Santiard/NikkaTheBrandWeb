package com.nikkathebrand.backend.controller;

import com.nikkathebrand.backend.model.Collection;
import com.nikkathebrand.backend.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@CrossOrigin(origins = "*")
public class CollectionController {

    @Autowired
    private CollectionRepository collectionRepository;

    @GetMapping
    public ResponseEntity<List<Collection>> getAllCollections() {
        return ResponseEntity.ok(collectionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Collection> getCollectionById(@PathVariable Long id) {
        return collectionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
