package com.nikkathebrand.backend.repository;

import com.nikkathebrand.backend.model.CarouselCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarouselCardRepository extends JpaRepository<CarouselCard, Long> {
    List<CarouselCard> findAllByOrderByDisplayOrderAsc();
}
