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
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) Boolean deleted
    ) {
        return ResponseEntity.ok(productService.getFilteredProducts(type, category, available, deleted));
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
                .filter(p -> p.getType().equals(ProductType.BREAD))
                .toList());

        ingredients.put("MEAT_OPTIONS", availableProducts.stream()
                .filter(p -> p.getType().equals(ProductType.MEAT))
                .toList());

        ingredients.put("BURGER_CHEESE", availableProducts.stream()
                .filter(p -> p.getType().equals(ProductType.BURGER_CHEESE))
                .toList());

        ingredients.put("BURGER_TOPPINGS", availableProducts.stream()
                .filter(p -> p.getType().equals(ProductType.BURGER_TOPPINGS))
                .toList());

        ingredients.put("BURGER_SAUCES", availableProducts.stream()
                .filter(p -> p.getType().equals(ProductType.CONDIMENTS))
                .toList());

        ingredients.put("PIZZA_DOUGH", availableProducts.stream()
                .filter(p -> p.getType().equals(ProductType.DOUGH))
                .toList());

        ingredients.put("PIZZA_SIZES", availableProducts.stream()
                .filter(p -> p.getType().equals(ProductType.PIZZA_SIZE))
                .toList());

        ingredients.put("PIZZA_SAUCE", availableProducts.stream()
                .filter(p -> p.getType().equals(ProductType.SAUCE))
                .toList());

        ingredients.put("PIZZA_CHEESE", availableProducts.stream()
                .filter(p -> p.getType().equals(ProductType.PIZZA_CHEESE))
                .toList());

        ingredients.put("PIZZA_TOPPINGS", availableProducts.stream()
                .filter(p -> p.getType().equals(ProductType.PIZZA_TOPPINGS))
                .toList());


        return ResponseEntity.ok(ingredients);
    }
    @GetMapping("/extras")
    public ResponseEntity<Map<String, List<ProductDto>>> getExtrasGrouped() {
        List<ProductDto> allProducts = productService.getAllProducts();

        // Filter only available products from EXTRA category
        List<ProductDto> availableExtras = allProducts.stream()
                .filter(p -> p.getAvailable() != null && p.getAvailable())
                .filter(p -> p.getCategory() != null && p.getCategory().equals(ProductCategory.EXTRA))
                .toList();

        Map<String, List<ProductDto>> extras = new HashMap<>();

        extras.put("BEVERAGE", availableExtras.stream()
                .filter(p -> p.getType().equals(ProductType.BEVERAGE))
                .toList());

        extras.put("DESSERT", availableExtras.stream()
                .filter(p -> p.getType().equals(ProductType.DESSERT))
                .toList());

        extras.put("SIDE", availableExtras.stream()
                .filter(p -> p.getType().equals(ProductType.SIDE))
                .toList());

        extras.put("OTHER", availableExtras.stream()
                .filter(p -> p.getType().equals(ProductType.OTHER))
                .toList());

        return ResponseEntity.ok(extras);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductDto productDto) {
        return ResponseEntity.ok(productService.updateProduct(
                id, productDto
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        return productService.deleteProduct(id);
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
}