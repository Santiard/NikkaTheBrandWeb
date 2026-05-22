package com.nikkathebrand.backend.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
    // Datos del cliente
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private String customerCity;
    private String customerDepartment;

    // Items del carrito
    private List<CartItemRequest> items;
}
