package uy.um.edu.pizzumburgum.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.ProductCategory;
import uy.um.edu.pizzumburgum.entities.ProductType;
import uy.um.edu.pizzumburgum.services.ProductService;

import java.math.BigDecimal;
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
    public ResponseEntity<List<ProductDto>> getFilteredProducts(
            @RequestParam(required = false) ProductType type,
            @RequestParam(required = false) ProductCategory category,
            @RequestParam(required = false) Boolean available
    ) {
        return ResponseEntity.ok(productService.getFilteredProducts(type, category, available));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/ingredients")
    public ResponseEntity<Map<String, List<ProductDto>>> getIngredientsGrouped() {
        List<ProductDto> allProducts = productService.getAllProducts();

        // Filter only available products
        List<ProductDto> availableProducts = allProducts.stream()
                .filter(p -> p.getAvailable() != null && p.getAvailable())
                .toList();

        Map<String, List<ProductDto>> ingredients = new HashMap<>();

        ingredients.put("BREAD_OPTIONS", availableProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.BREAD))
                .toList());

        ingredients.put("MEAT_OPTIONS", availableProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.MEAT))
                .toList());

        ingredients.put("BURGER_CHEESE", availableProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.BURGER_CHEESE))
                .toList());

        ingredients.put("BURGER_TOPPINGS", availableProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.BURGER_TOPPINGS))
                .toList());

        ingredients.put("BURGER_SAUCES", availableProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.SAUCE))
                .toList());

        ingredients.put("PIZZA_DOUGH", availableProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.DOUGH))
                .toList());

        ingredients.put("PIZZA_SIZES", availableProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.PIZZA_SIZE))
                .toList());

        ingredients.put("PIZZA_SAUCE", availableProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.SAUCE))
                .toList());

        ingredients.put("PIZZA_CHEESE", availableProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.PIZZA_CHEESE))
                .toList());

        ingredients.put("PIZZA_TOPPINGS", availableProducts.stream()
                .filter(p -> p.getProductType().equals(ProductType.PIZZA_TOPPINGS))
                .toList());


        return ResponseEntity.ok(ingredients);
    }

    @PutMapping
    public ResponseEntity<ProductDto> updateProduct(
            @RequestParam Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) ProductType productType,
            @RequestParam(required = false) ProductCategory productCategory,
            @RequestParam(required = false) Boolean available) {
        return ResponseEntity.ok(productService.updateProduct(
                id, name, price, productType, productCategory, available
        ));
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

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(
                java.util.Arrays.stream(ProductCategory.values())
                        .map(Enum::name)
                        .toList()
        );
    }

    @GetMapping("/types")
    public ResponseEntity<List<String>> getTypes() {
        return ResponseEntity.ok(
                java.util.Arrays.stream(ProductType.values())
                        .map(Enum::name)
                        .toList()
        );
    }

    @GetMapping("/types/{category}")
    public ResponseEntity<List<String>> getTypesByCategory(@PathVariable ProductCategory category) {
        return ResponseEntity.ok(
                ProductType.getByCategory(category).stream()
                        .map(Enum::name)
                        .toList()
        );
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(@PathVariable ProductCategory category) {
        return ResponseEntity.ok(productService.getFilteredProducts(null, category, true));
    }
}