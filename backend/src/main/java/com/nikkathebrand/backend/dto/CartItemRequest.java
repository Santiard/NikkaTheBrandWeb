package com.nikkathebrand.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemRequest {
    private Long productId;
    private String size; // XS, S, M, L
    private Integer quantity;
}
