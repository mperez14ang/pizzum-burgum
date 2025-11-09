package uy.um.edu.pizzumburgum.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import uy.um.edu.pizzumburgum.dto.shared.ProductDto;
import uy.um.edu.pizzumburgum.entities.ProductCategory;
import uy.um.edu.pizzumburgum.entities.ProductType;
import uy.um.edu.pizzumburgum.repository.ProductRepository;
import uy.um.edu.pizzumburgum.services.ProductService;

import java.math.BigDecimal;

/**
 * Crea varios productos por defecto
 * **/
@Component
public class ProductInitializer implements CommandLineRunner {
    @Autowired
    private ProductRepository productRepository;

    private ProductService productService;

    public ProductInitializer(ProductService productService) {
        this.productService = productService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            this.addProducts();
        }
    }

    private void addProducts() {
        // PIZZAS - Masas
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Masa madre")
                        .price(new BigDecimal("150.00"))
                        .type(ProductType.DOUGH)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Masa tradicional")
                        .price(new BigDecimal("100.00"))
                        .type(ProductType.DOUGH)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        // PIZZAS - Tamaños
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Individual")
                        .price(new BigDecimal("0.00"))
                        .type(ProductType.PIZZA_SIZE)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Mediana")
                        .price(new BigDecimal("200.00"))
                        .type(ProductType.PIZZA_SIZE)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Grande")
                        .price(new BigDecimal("350.00"))
                        .type(ProductType.PIZZA_SIZE)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        // PIZZAS - Salsas
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Salsa de tomate")
                        .price(new BigDecimal("50.00"))
                        .type(ProductType.SAUCE)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Salsa blanca")
                        .price(new BigDecimal("80.00"))
                        .type(ProductType.SAUCE)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        // PIZZAS - Quesos
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Mozzarella")
                        .price(new BigDecimal("120.00"))
                        .type(ProductType.PIZZA_CHEESE)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Parmesano")
                        .price(new BigDecimal("150.00"))
                        .type(ProductType.PIZZA_CHEESE)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        // PIZZAS - Toppings
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Jamón")
                        .price(new BigDecimal("80.00"))
                        .type(ProductType.PIZZA_TOPPINGS)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Pepperoni")
                        .price(new BigDecimal("100.00"))
                        .type(ProductType.PIZZA_TOPPINGS)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Champiñones")
                        .price(new BigDecimal("70.00"))
                        .type(ProductType.PIZZA_TOPPINGS)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Aceitunas negras")
                        .price(new BigDecimal("60.00"))
                        .type(ProductType.PIZZA_TOPPINGS)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Morrones")
                        .price(new BigDecimal("60.00"))
                        .type(ProductType.PIZZA_TOPPINGS)
                        .category(ProductCategory.PIZZA)
                        .build()
        );

        // HAMBURGUESAS - Panes
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Pan de papa")
                        .price(new BigDecimal("80.00"))
                        .type(ProductType.BREAD)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Pan brioche")
                        .price(new BigDecimal("100.00"))
                        .type(ProductType.BREAD)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Pan integral")
                        .price(new BigDecimal("90.00"))
                        .type(ProductType.BREAD)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        // HAMBURGUESAS - Carnes
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Carne de res 150g")
                        .price(new BigDecimal("200.00"))
                        .type(ProductType.MEAT)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Carne de pollo 150g")
                        .price(new BigDecimal("180.00"))
                        .type(ProductType.MEAT)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Hamburguesa vegetariana")
                        .price(new BigDecimal("190.00"))
                        .type(ProductType.MEAT)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        // HAMBURGUESAS - Quesos
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Cheddar")
                        .price(new BigDecimal("70.00"))
                        .type(ProductType.BURGER_CHEESE)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Queso azul")
                        .price(new BigDecimal("90.00"))
                        .type(ProductType.BURGER_CHEESE)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Queso suizo")
                        .price(new BigDecimal("80.00"))
                        .type(ProductType.BURGER_CHEESE)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        // HAMBURGUESAS - Toppings
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Lechuga")
                        .price(new BigDecimal("30.00"))
                        .type(ProductType.BURGER_TOPPINGS)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Tomate")
                        .price(new BigDecimal("30.00"))
                        .type(ProductType.BURGER_TOPPINGS)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Cebolla")
                        .price(new BigDecimal("25.00"))
                        .type(ProductType.BURGER_TOPPINGS)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Bacon")
                        .price(new BigDecimal("80.00"))
                        .type(ProductType.BURGER_TOPPINGS)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Huevo frito")
                        .price(new BigDecimal("50.00"))
                        .type(ProductType.BURGER_TOPPINGS)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        // HAMBURGUESAS - Condimentos
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Ketchup")
                        .price(new BigDecimal("20.00"))
                        .type(ProductType.CONDIMENTS)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Mostaza")
                        .price(new BigDecimal("20.00"))
                        .type(ProductType.CONDIMENTS)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Mayonesa")
                        .price(new BigDecimal("20.00"))
                        .type(ProductType.CONDIMENTS)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Salsa BBQ")
                        .price(new BigDecimal("30.00"))
                        .type(ProductType.CONDIMENTS)
                        .category(ProductCategory.HAMBURGER)
                        .build()
        );

        // EXTRAS - Bebidas
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Coca Cola 600ml")
                        .price(new BigDecimal("80.00"))
                        .type(ProductType.BEVERAGE)
                        .category(ProductCategory.EXTRA)
                        .image("https://www.cofas.com.uy/wp-content/uploads/2024/05/330596.jpg")
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Agua mineral 500ml")
                        .price(new BigDecimal("60.00"))
                        .type(ProductType.BEVERAGE)
                        .category(ProductCategory.EXTRA)
                        .image("https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400")
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Cerveza Pilsen 330ml")
                        .price(new BigDecimal("120.00"))
                        .type(ProductType.BEVERAGE)
                        .category(ProductCategory.EXTRA)
                        .image("https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400")
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Jugo natural de naranja")
                        .price(new BigDecimal("100.00"))
                        .type(ProductType.BEVERAGE)
                        .category(ProductCategory.EXTRA)
                        .image("https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400")
                        .build()
        );

        // EXTRAS - Acompañamientos
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Papas fritas")
                        .price(new BigDecimal("150.00"))
                        .type(ProductType.SIDE)
                        .category(ProductCategory.EXTRA)
                        .image("https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400")
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Aros de cebolla")
                        .price(new BigDecimal("170.00"))
                        .type(ProductType.SIDE)
                        .category(ProductCategory.EXTRA)
                        .image("https://images.unsplash.com/photo-1639024471283-03518883512d?w=400")
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Ensalada mixta")
                        .price(new BigDecimal("180.00"))
                        .type(ProductType.SIDE)
                        .category(ProductCategory.EXTRA)
                        .image("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400")
                        .build()
        );

        // EXTRAS - Postres
        this.productService.createProduct(
                ProductDto.builder()
                        .name("Brownie con helado")
                        .price(new BigDecimal("200.00"))
                        .type(ProductType.DESSERT)
                        .category(ProductCategory.EXTRA)
                        .image("https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400")
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Flan casero")
                        .price(new BigDecimal("150.00"))
                        .type(ProductType.DESSERT)
                        .category(ProductCategory.EXTRA)
                        .image("https://images.unsplash.com/photo-1551006079-4f18cd935e85?w=400")
                        .build()
        );

        this.productService.createProduct(
                ProductDto.builder()
                        .name("Helado 2 bochas")
                        .price(new BigDecimal("130.00"))
                        .type(ProductType.DESSERT)
                        .category(ProductCategory.EXTRA)
                        .image("https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400")
                        .build()
        );
    }
}
