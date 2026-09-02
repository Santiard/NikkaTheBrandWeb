package com.nikkathebrand.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "carousel_cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarouselCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String imageUrl;

    @Column(nullable = false)
    private String targetPage;

    private String targetFilter;

    @Column(nullable = false)
    private Integer displayOrder;
}
