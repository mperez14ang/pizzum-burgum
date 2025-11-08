package uy.um.edu.pizzumburgum.entities;

import java.util.Arrays;
import java.util.List;

public enum ProductType {
    // Hamburger types
    BREAD(ProductCategory.HAMBURGER),
    MEAT(ProductCategory.HAMBURGER),
    BURGER_TOPPINGS(ProductCategory.HAMBURGER),
    BURGER_CHEESE(ProductCategory.HAMBURGER),
    CONDIMENTS(ProductCategory.HAMBURGER),

    // Pizza types
    DOUGH(ProductCategory.PIZZA),
    PIZZA_TOPPINGS(ProductCategory.PIZZA),
    PIZZA_CHEESE(ProductCategory.PIZZA),
    PIZZA_SIZE(ProductCategory.PIZZA),
    SAUCE(ProductCategory.PIZZA),

    // Extra types (bebidas, postres, acompañamientos)
    BEVERAGE(ProductCategory.EXTRA),
    DESSERT(ProductCategory.EXTRA),
    SIDE(ProductCategory.EXTRA),
    OTHER(ProductCategory.EXTRA);

    private final ProductCategory category;

    ProductType(ProductCategory category) {
        this.category = category;
    }

    public ProductCategory getCategory() {
        return category;
    }

    public static List<ProductType> getByCategory(ProductCategory category) {
        return Arrays.stream(values())
                .filter(type -> type.category == category)
                .toList();
    }
}