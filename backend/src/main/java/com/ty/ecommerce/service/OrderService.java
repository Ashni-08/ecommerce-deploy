package com.ty.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ty.ecommerce.entity.Orders;
import com.ty.ecommerce.dto.OrderRequest;
import com.ty.ecommerce.repository.OrderRepository;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Orders placeOrder(OrderRequest request) {

        System.out.println("ProductName: " + request.getProductName());
        System.out.println("UserId: " + request.getUserId());
        System.out.println("ProductId: " + request.getProductId());
        System.out.println("Quantity: " + request.getQuantity());

        Orders order = new Orders();

        order.setUserId(request.getUserId());
        order.setProductId(request.getProductId());
        order.setQuantity(request.getQuantity());
        order.setTotalPrice(request.getQuantity() * 1000);

        order.setProductName(request.getProductName());
        order.setProductImage(request.getProductImage());
        order.setStatus("ORDERED");

        // ✅ ADD THIS
        order.setProductImage(request.getProductImage());

        return orderRepository.save(order);
    }

    public List<Orders> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}