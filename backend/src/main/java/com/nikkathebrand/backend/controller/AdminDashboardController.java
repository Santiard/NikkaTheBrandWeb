package com.nikkathebrand.backend.controller;

import com.nikkathebrand.backend.model.Customer;
import com.nikkathebrand.backend.model.Order;
import com.nikkathebrand.backend.model.OrderItem;
import com.nikkathebrand.backend.repository.CustomerRepository;
import com.nikkathebrand.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminDashboardController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerRepository.findAll());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findByOrderByOrderDateDesc());
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalyticsSummary() {
        List<Order> orders = orderRepository.findAll();
        List<Customer> customers = customerRepository.findAll();

        BigDecimal totalSales = BigDecimal.ZERO;
        int totalOrdersCount = orders.size();
        int totalCustomersCount = customers.size();

        Map<String, BigDecimal> salesByCategory = new HashMap<>();
        Map<String, Integer> productQuantities = new HashMap<>();
        Map<String, String> productNames = new HashMap<>(); // ID a Nombre

        for (Order order : orders) {
            if (order.getTotalAmount() != null) {
                totalSales = totalSales.add(order.getTotalAmount());
            }

            if (order.getOrderItems() != null) {
                for (OrderItem item : order.getOrderItems()) {
                    if (item.getProduct() != null) {
                        String category = item.getProduct().getCategory();
                        BigDecimal itemRevenue = item.getUnitPrice().multiply(new BigDecimal(item.getQuantity()));

                        // Venta por Categoría
                        salesByCategory.put(category, salesByCategory.getOrDefault(category, BigDecimal.ZERO).add(itemRevenue));

                        // Cantidad por Producto
                        String prodId = String.valueOf(item.getProduct().getId());
                        productQuantities.put(prodId, productQuantities.getOrDefault(prodId, 0) + item.getQuantity());
                        productNames.put(prodId, item.getProduct().getName());
                    }
                }
            }
        }

        // Construir Lista de Productos Más Vendidos
        List<Map<String, Object>> topSellingProducts = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : productQuantities.entrySet()) {
            Map<String, Object> prodStat = new HashMap<>();
            prodStat.put("id", entry.getKey());
            prodStat.put("name", productNames.get(entry.getKey()));
            prodStat.put("quantity", entry.getValue());
            topSellingProducts.add(prodStat);
        }

        // Ordenar los más vendidos por cantidad descendente
        topSellingProducts.sort((a, b) -> Integer.compare((Integer) b.get("quantity"), (Integer) a.get("quantity")));
        if (topSellingProducts.size() > 5) {
            topSellingProducts = topSellingProducts.subList(0, 5); // Solo el top 5
        }

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalSales", totalSales);
        analytics.put("totalOrders", totalOrdersCount);
        analytics.put("totalCustomers", totalCustomersCount);
        analytics.put("salesByCategory", salesByCategory);
        analytics.put("topProducts", topSellingProducts);

        return ResponseEntity.ok(analytics);
    }
}
