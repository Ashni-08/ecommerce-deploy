package com.ty.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ty.ecommerce.entity.Orders;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {

    // ✅ Fetch all orders for a specific user
    List<Orders> findByUserId(Long userId);
}