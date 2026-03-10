package com.ty.ecommerce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ty.ecommerce.entity.Cart;
import com.ty.ecommerce.repository.CartRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    // Add product to cart
    public Cart addToCart(Cart cart) {

        cart.setId(null);

        return cartRepository.save(cart);
    }

    // Get cart items
    public List<Cart> getCartItems() {
        return cartRepository.findAll();
    }

    // Remove item
    public void removeItem(Long id) {
        cartRepository.deleteById(id);
    }

}