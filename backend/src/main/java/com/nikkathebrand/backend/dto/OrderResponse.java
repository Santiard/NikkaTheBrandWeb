package com.nikkathebrand.backend.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long orderId;
    private String status;
    private BigDecimal totalAmount;
    private String whatsappUrl;
}
