package com.nikkathebrand.backend.controller;

import com.nikkathebrand.backend.model.CarouselCard;
import com.nikkathebrand.backend.repository.CarouselCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carousel")
@CrossOrigin(origins = "*")
public class CarouselCardController {

    @Autowired
    private CarouselCardRepository carouselCardRepository;

    @GetMapping
    public ResponseEntity<List<CarouselCard>> getCarouselCards() {
        return ResponseEntity.ok(carouselCardRepository.findAllByOrderByDisplayOrderAsc());
    }
}
