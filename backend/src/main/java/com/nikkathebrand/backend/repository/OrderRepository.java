package com.nikkathebrand.backend.repository;

import com.nikkathebrand.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerPhone(String phone);
    List<Order> findByOrderByOrderDateDesc();
}
