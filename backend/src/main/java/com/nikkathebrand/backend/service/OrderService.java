package com.nikkathebrand.backend.service;

import com.nikkathebrand.backend.dto.CartItemRequest;
import com.nikkathebrand.backend.dto.OrderRequest;
import com.nikkathebrand.backend.dto.OrderResponse;
import com.nikkathebrand.backend.model.*;
import com.nikkathebrand.backend.repository.CustomerRepository;
import com.nikkathebrand.backend.repository.OrderRepository;
import com.nikkathebrand.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Value("${nikka.whatsapp.phone:573001234567}")
    private String whatsappPhone;

    @Transactional
    public OrderResponse processCheckout(OrderRequest request) {
        // 1. Crear el Cliente
        Customer customer = Customer.builder()
                .name(request.getCustomerName())
                .phone(request.getCustomerPhone())
                .address(request.getCustomerAddress())
                .city(request.getCustomerCity())
                .department(request.getCustomerDepartment())
                .build();

        // 2. Crear la Orden (Inicial)
        Order order = Order.builder()
                .orderDate(LocalDateTime.now())
                .status("PENDING")
                .customer(customer)
                .totalAmount(BigDecimal.ZERO)
                .orderItems(new ArrayList<>())
                .build();

        BigDecimal grandTotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // 3. Procesar cada item del carrito
        for (CartItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("El producto con ID " + itemReq.getProductId() + " no existe."));

            // Validar y descontar stock por talla
            SizeInventory sizeInv = product.getSizes().stream()
                    .filter(s -> s.getSize().equalsIgnoreCase(itemReq.getSize()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("La talla " + itemReq.getSize() + " no está disponible para el producto: " + product.getName()));

            if (sizeInv.getStock() < itemReq.getQuantity()) {
                throw new IllegalStateException("Stock insuficiente para " + product.getName() + " en talla " + itemReq.getSize() + ". Disponible: " + sizeInv.getStock());
            }

            // Reducir stock
            sizeInv.setStock(sizeInv.getStock() - itemReq.getQuantity());

            // Calcular precio unitario aplicando descuento si tiene
            BigDecimal unitPrice = product.getPrice();
            if (product.getDiscountPercentage() != null && product.getDiscountPercentage() > 0) {
                BigDecimal discountFactor = BigDecimal.valueOf(100 - product.getDiscountPercentage())
                        .divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP);
                unitPrice = unitPrice.multiply(discountFactor);
            }

            // Calcular subtotal
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            grandTotal = grandTotal.add(subtotal);

            // Crear el item de orden
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .size(itemReq.getSize().toUpperCase())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(unitPrice)
                    .order(order)
                    .build();

            orderItems.add(orderItem);
        }

        order.setTotalAmount(grandTotal);
        order.setOrderItems(orderItems);

        // 4. Guardar Orden (y por cascada el cliente y los items)
        Order savedOrder = orderRepository.save(order);

        // 5. Formatear Mensaje de WhatsApp
        String whatsappUrl = generateWhatsappUrl(savedOrder);

        return OrderResponse.builder()
                .orderId(savedOrder.getId())
                .status(savedOrder.getStatus())
                .totalAmount(savedOrder.getTotalAmount())
                .whatsappUrl(whatsappUrl)
                .build();
    }

    private String generateWhatsappUrl(Order order) {
        Customer c = order.getCustomer();
        StringBuilder sb = new StringBuilder();

        sb.append("Hola Nikka The Brand \uD83D\uDC11 Me encantaría realizar un pedido:\n\n");
        sb.append("DATOS DE ENVÍO:\n");
        sb.append("* Nombre: ").append(c.getName()).append("\n");
        sb.append("* Teléfono: ").append(c.getPhone()).append("\n");
        sb.append("* Dirección: ").append(c.getAddress()).append("\n");
        sb.append("* Ciudad: ").append(c.getCity()).append("\n\n");

        sb.append("\uD83E\uDDFA DETALLE DE TU COMPRA (Orden #").append(order.getId()).append("):\n");

        for (OrderItem item : order.getOrderItems()) {
            sb.append("* ").append(item.getQuantity()).append("x ")
              .append(item.getProduct().getName())
              .append(" - Talla: ").append(item.getSize())
              .append(" - C/U: $").append(item.getUnitPrice().setScale(0)).append(" COP\n");
        }

        sb.append("\nTOTAL A PAGAR: $").append(order.getTotalAmount().setScale(0)).append(" COP");

        String encodedText = URLEncoder.encode(sb.toString(), StandardCharsets.UTF_8);
        return "https://api.whatsapp.com/send?phone=" + whatsappPhone + "&text=" + encodedText;
    }
}
