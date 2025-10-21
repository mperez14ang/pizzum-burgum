package uy.um.edu.pizzumburgum.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.ProductCategory;
import uy.um.edu.pizzumburgum.entities.ProductType;
import uy.um.edu.pizzumburgum.services.ProductService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto) {
        ProductDto created = productService.createProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(@PathVariable ProductCategory category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ProductDto>> getProductsByType(@PathVariable ProductType type) {
        return ResponseEntity.ok(productService.getProductsByType(type));
    }
    @GetMapping("/ingredients")
    public ResponseEntity<Map<String, List<ProductDto>>> getIngredientsGrouped() {
        List<ProductDto> allProducts = productService.getAllProducts();

        Map<String, List<ProductDto>> ingredients = new HashMap<>();

        ingredients.put("BREAD_OPTIONS", allProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.BREAD))
                .toList());

        ingredients.put("MEAT_OPTIONS", allProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.MEAT))
                .toList());

        ingredients.put("BURGER_CHEESE", allProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.BURGER_CHEESE))
                .toList());

        ingredients.put("BURGER_TOPPINGS", allProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.BURGER_TOPPINGS))
                .toList());

        ingredients.put("BURGER_SAUCES", allProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.SAUCE))
                .toList());

        ingredients.put("PIZZA_DOUGH", allProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.DOUGH))
                .toList());

        ingredients.put("PIZZA_SIZES", allProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.PIZZA_SIZE))
                .toList());

        ingredients.put("PIZZA_SAUCE", allProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.SAUCE))
                .toList());

        ingredients.put("PIZZA_CHEESE", allProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.PIZZA_CHEESE))
                .toList());

        ingredients.put("PIZZA_TOPPINGS", allProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.PIZZA_TOPPINGS))
                .toList());


        return ResponseEntity.ok(ingredients);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody ProductDto productDto) {
        return ResponseEntity.ok(productService.updateProduct(id, productDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}