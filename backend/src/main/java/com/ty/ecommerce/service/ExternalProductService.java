package com.ty.ecommerce.service;

import com.ty.ecommerce.entity.Product;
import com.ty.ecommerce.repository.ProductRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ExternalProductService {

    private final ProductRepository productRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public ExternalProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> importProducts() {
        List<Product> allProducts = new ArrayList<>();

        // 1. Fetch from DummyJSON
        try {
            Map<String, Object> dummyRes = restTemplate.exchange(
                    "https://dummyjson.com/products?limit=50",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    }).getBody();

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> dummyProducts = (List<Map<String, Object>>) dummyRes.get("products");
            for (Map<String, Object> p : dummyProducts) {
                Product product = new Product();
                product.setTitle((String) p.get("title"));
                product.setDescription((String) p.get("description"));
                product.setPrice(Double.parseDouble(p.get("price").toString()));
                product.setImage((String) p.get("thumbnail"));
                product.setCategory((String) p.get("category"));
                product.setBrand((String) p.get("brand"));
                allProducts.add(product);
            }
        } catch (Exception e) {
            System.err.println("Error fetching from DummyJSON: " + e.getMessage());
        }

        // 2. Fetch from FakeStoreAPI
        try {
            List<Map<String, Object>> fakeProducts = restTemplate.exchange(
                    "https://fakestoreapi.com/products",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {
                    }).getBody();
            for (Map<String, Object> p : fakeProducts) {
                Product product = new Product();
                product.setTitle((String) p.get("title"));
                product.setDescription((String) p.get("description"));
                product.setPrice(Double.parseDouble(p.get("price").toString()));
                product.setImage((String) p.get("image"));
                product.setCategory((String) p.get("category"));
                product.setBrand("N/A");
                allProducts.add(product);
            }
        } catch (Exception e) {
            System.err.println("Error fetching from FakeStoreAPI: " + e.getMessage());
        }

        // Save all and return
        return productRepository.saveAll(allProducts);
    }
}
