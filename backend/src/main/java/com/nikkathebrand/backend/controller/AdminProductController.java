package com.nikkathebrand.backend.controller;

import com.nikkathebrand.backend.model.Product;
import com.nikkathebrand.backend.model.ProductImage;
import com.nikkathebrand.backend.model.SizeInventory;
import com.nikkathebrand.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "*")
public class AdminProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<java.util.List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // Enlazar imágenes y tallas con la entidad Product para mantener la integridad referencial en JPA
        if (product.getImages() != null) {
            for (ProductImage img : product.getImages()) {
                img.setProduct(product);
            }
        }
        if (product.getSizes() != null) {
            for (SizeInventory size : product.getSizes()) {
                size.setProduct(product);
            }
        }
        Product saved = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product existingProduct = optionalProduct.get();
        existingProduct.setName(productDetails.getName());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setDiscountPercentage(productDetails.getDiscountPercentage());
        existingProduct.setCategory(productDetails.getCategory());
        if (productDetails.getActive() != null) {
            existingProduct.setActive(productDetails.getActive());
        }

        // Actualizar colección si se proporciona
        if (productDetails.getCollection() != null) {
            existingProduct.setCollection(productDetails.getCollection());
        }

        // Actualizar imágenes y tallas
        if (productDetails.getImages() != null) {
            existingProduct.getImages().clear();
            for (ProductImage img : productDetails.getImages()) {
                img.setProduct(existingProduct);
                existingProduct.getImages().add(img);
            }
        }

        if (productDetails.getSizes() != null) {
            existingProduct.getSizes().clear();
            for (SizeInventory size : productDetails.getSizes()) {
                size.setProduct(existingProduct);
                existingProduct.getSizes().add(size);
            }
        }

        Product updated = productRepository.save(existingProduct);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
