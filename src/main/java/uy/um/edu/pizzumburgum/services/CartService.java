package uy.um.edu.pizzumburgum.services;

import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.*;
import uy.um.edu.pizzumburgum.dto.response.CartResponse;
import uy.um.edu.pizzumburgum.dto.response.OrderByResponse;
import uy.um.edu.pizzumburgum.entities.*;
import uy.um.edu.pizzumburgum.mapper.*;
import uy.um.edu.pizzumburgum.repository.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CartService {

    @Autowired
    private OrderByRepository orderByRepository;

    @Autowired
    private OrderHasCreationsRepository orderHasCreationsRepository;

    @Autowired
    private CreationRepository creationRepository;

    @Autowired
    private CreationHasProductsRepository creationHasProductsRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AddressRepository addressRepository;

    //Agrega una creación personalizada al carrito: si no existe carrito activo, lo crea (SIN DIRECCIÓN todavía)

    @Transactional
    public CartResponse addToCart(AddToCartRequest request, String clientEmail) {
        log.info("Agregando item al carrito para cliente: {}", clientEmail);

        // 1. Validar cliente
        Client client = clientRepository.findById(clientEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cliente con email " + clientEmail + " no encontrado"
                ));

        // 2. Buscar o crear carrito activo (UNPAID) - SIN DIRECCIÓN
        OrderBy cart = orderByRepository
                .findByClientEmailAndState(clientEmail, OrderState.UNPAID)
                .orElseGet(() -> {
                    log.info("No existe carrito activo, creando uno nuevo");

                    // Crear con una dirección temporal (la primera del cliente)
                    Address tempAddress = client.getAddresses().stream()
                            .findFirst()
                            .orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.BAD_REQUEST,
                                    "El cliente no tiene direcciones registradas"
                            ));

                    OrderBy newCart = OrderBy.builder()
                            .client(client)
                            .address(tempAddress) // Temporal, se cambiará en checkout
                            .state(OrderState.UNPAID)
                            .creations(new HashSet<>())
                            .build();
                    return orderByRepository.save(newCart);
                });

        // 3. Validar productos (ingredientes)
        Set<Product> products = new HashSet<>();
        Set<CreationHasProducts> creationHasProducts = new HashSet<>();
        for (CreationHasProductsRequest creationHasProductsRequest : request.getProducts()) {
            Long productId = creationHasProductsRequest.getProductId();
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Producto con ID " + productId + " no encontrado"
                    ));
            products.add(product);

            // CreationHasProducts
            creationHasProducts.add(CreationHasProducts.builder()
                            .quantity(creationHasProductsRequest.getQuantity())
                            .product(product)
                    .build());
        }

        // 4. Calcular precio (suma de precios de productos)
        BigDecimal totalPrice = products.stream()
                .map(Product::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 5. Crear nombre default según tipo
        String creationName = request.getType() == CreationType.PIZZA
                ? "Pizza Personalizada"
                : "Hamburguesa Personalizada";

        // 6. Crear Creation
        Creation creation = Creation.builder()
                .name(creationName)
                .type(request.getType())
                .price(totalPrice.floatValue())
                .products(new HashSet<>())
                .order(new HashSet<>())
                .available(true)
                .build();

        creation = creationRepository.save(creation);
        log.info("Creation creada con ID: {} y precio: {}", creation.getId(), totalPrice);

        // 7. Vincular productos a la creation (CreationHasProducts)
        for (CreationHasProducts creationHasProducts1 : creationHasProducts) {
            CreationHasProducts chp = CreationHasProducts.builder()
                    .creation(creation)
                    .product(creationHasProducts1.getProduct())
                    .quantity(creationHasProducts1.getQuantity())
                    .build();
            creationHasProductsRepository.save(chp);
            creation.getProducts().add(chp);
        }

        // 8. Crear OrderHasCreations (item del carrito)
        OrderHasCreations cartItem = OrderHasCreations.builder()
                .order(cart)
                .creation(creation)
                .quantity(request.getQuantity())
                .build();

        cartItem = orderHasCreationsRepository.save(cartItem);
        cart.getCreations().add(cartItem);

        log.info("Item agregado al carrito exitosamente");

        // 9. Retornar respuesta
        return CartMapper.toCartResponse(cart);
    }

    /**
     * Agrega una creacion ya creada a un carrito activo
     */
    @Transactional
    public CartResponse addCreationToCart(OrderHasCreationsRequest request, String clientEmail) {
        OrderBy cart = this.getActiveCart(clientEmail);

        // Verificar que la creacion existe
        Creation creation = creationRepository.findById(request.getCreationId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Creation con ID " + request.getCreationId() + " no encontrada"
                ));

        OrderHasCreations cartItem = OrderHasCreations.builder()
                .order(cart)
                .creation(creation)
                .quantity(request.getQuantity())
                .build();

        // 4. Calcular precio (suma de precios de productos)
        BigDecimal totalPrice = creation.getProducts().stream()
                .map(product -> {
                    return product.getProduct().getPrice();
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        creation.setPrice(totalPrice.floatValue());

        cartItem = orderHasCreationsRepository.save(cartItem);

        cart.getCreations().add(cartItem);

        cart = orderByRepository.save(cart);

        log.info("Creation {} agregada al carrito exitosamente", creation.getId());

        return CartMapper.toCartResponse(cart);
    }

    /**
     * Obtiene el carrito activo de un cliente
     */
    @Transactional(readOnly = true)
    public CartResponse getCart(String clientEmail) {
        OrderBy cart = this.getActiveCart(clientEmail);

        return CartMapper.toCartResponse(cart);
    }

    /**
     * Actualiza la cantidad de un item en el carrito
     */
    @Transactional
    public CartResponse updateCartItemQuantity(String clientEmail, Long itemId, UpdateCartItemRequest request) {
        log.info("Actualizando cantidad del item {} en carrito", itemId);

        // Validar orden
        OrderBy cart = this.getActiveCart(clientEmail);

        // Buscar item
        OrderHasCreations item = orderHasCreationsRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item con ID " + itemId + " no encontrado"
                ));

        // Verificar que pertenece a esta orden
        if (!item.getOrder().getId().equals(cart.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El item no pertenece a este carrito"
            );
        }

        // Actualizar cantidad
        item.setQuantity(request.getQuantity());
        orderHasCreationsRepository.save(item);

        log.info("Cantidad actualizada exitosamente");

        return CartMapper.toCartResponse(cart);
    }

    //Elimina un item del carrito

    @Transactional
    public CartResponse removeCartItem(String clientEmail, Long itemId) {
        log.info("Eliminando item {} del carrito de {}", itemId, clientEmail);

        // Validar orden
        OrderBy cart = this.getActiveCart(clientEmail);

        // Buscar item
        OrderHasCreations item = orderHasCreationsRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item con ID " + itemId + " no encontrado"
                ));

        // Verificar pertenencia
        if (!item.getOrder().getId().equals(cart.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El item no pertenece a este carrito"
            );
        }

        // Eliminar item
        cart.getCreations().remove(item);
        orderHasCreationsRepository.delete(item);

        log.info("Item eliminado exitosamente");

        return CartMapper.toCartResponse(cart);
    }

    //Vacía completamente el carrito

    @Transactional
    public void clearCart(String clientEmail) {
        log.info("Vaciando carrito de " + clientEmail);

        OrderBy cart = this.getActiveCart(clientEmail);

        orderHasCreationsRepository.deleteAll(cart.getCreations());
        cart.getCreations().clear();
        orderByRepository.save(cart);

        log.info("Carrito vaciado exitosamente");
    }

    //Finaliza la compra: asigna dirección, metodo de pago y cambia estado (UNPAID → IN_QUEUE)
    @Transactional
    public OrderByResponse checkout(String clientEmail, CheckoutRequest request) {
        log.info("Finalizando compra del carrito del usuario {}", clientEmail);

        OrderBy cart = this.getActiveCart(clientEmail);

        // Validar que tenga items
        if (cart.getCreations().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede finalizar un carrito vacío"
            );
        }

        // Validar y asignar dirección de entrega
        Address deliveryAddress = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Dirección con ID " + request.getAddressId() + " no encontrada"
                ));

        // Verificar que la dirección pertenece al cliente
        if (!deliveryAddress.getClient().getEmail().equals(cart.getClient().getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La dirección seleccionada no pertenece al cliente"
            );
        }

        // Asignar dirección de entrega
        cart.setAddress(deliveryAddress);

        // El metodo de pago se puede mostrar en frontend pero no lo guardamos en BD
        // Si quisieras guardarlo, tendrías que agregar un campo en OrderBy
        log.info("Método de pago seleccionado: {}", request.getPaymentMethod());

        // Cambiar estado a IN_QUEUE
        cart.setState(OrderState.IN_QUEUE);
        orderByRepository.save(cart);

        log.info("Compra finalizada exitosamente. Orden en cola de preparación");

        return OrderByMapper.toOrderByDto(cart);
    }

    private OrderBy getActiveCart(String clientEmail){
        log.info("Obteniendo carrito activo para cliente: {}", clientEmail);

        OrderBy cart = orderByRepository
                .findByClientEmailAndState(clientEmail, OrderState.UNPAID)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe un carrito activo para el cliente " + clientEmail
                ));
        // Validar que esté en estado UNPAID
        if (cart.getState() != OrderState.UNPAID) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Carrito activo no puede estar en estado " + cart.getState()
            );
        }
        return cart;
    }
}