package com.ty.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ty.ecommerce.entity.Orders;
import com.ty.ecommerce.dto.OrderRequest;
import com.ty.ecommerce.service.OrderService;

import java.util.List;   // ✅ ADD THIS

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")  // 🔥 change this
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/buyNow")
    public ResponseEntity<Orders> buyNow(@RequestBody OrderRequest request) {
        Orders order = orderService.placeOrder(request);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Orders>> getOrdersByUser(@PathVariable Long userId) {
        List<Orders> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(orders);
    }
}