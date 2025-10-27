package uy.um.edu.pizzumburgum.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.AddToCartRequest;
import uy.um.edu.pizzumburgum.dto.request.CheckoutRequest;
import uy.um.edu.pizzumburgum.dto.request.UpdateCartItemRequest;
import uy.um.edu.pizzumburgum.dto.response.CartResponse;
import uy.um.edu.pizzumburgum.dto.response.OrderByResponse;
import uy.um.edu.pizzumburgum.entities.*;
import uy.um.edu.pizzumburgum.mapper.CartMapper;
import uy.um.edu.pizzumburgum.mapper.OrderByMapper;
import uy.um.edu.pizzumburgum.repository.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

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
    public CartResponse addToCart(AddToCartRequest request) {
        log.info("Agregando item al carrito para cliente: {}", request.getClientEmail());

        // 1. Validar cliente
        Client client = clientRepository.findById(request.getClientEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cliente con email " + request.getClientEmail() + " no encontrado"
                ));

        // 2. Buscar o crear carrito activo (UNPAID) - SIN DIRECCIÓN
        OrderBy cart = orderByRepository
                .findByClientEmailAndState(request.getClientEmail(), OrderState.UNPAID)
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
        for (Long productId : request.getProductIds()) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Producto con ID " + productId + " no encontrado"
                    ));
            products.add(product);
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
                .build();

        creation = creationRepository.save(creation);
        log.info("Creation creada con ID: {} y precio: {}", creation.getId(), totalPrice);

        // 7. Vincular productos a la creation (CreationHasProducts)
        for (Product product : products) {
            CreationHasProducts chp = CreationHasProducts.builder()
                    .creation(creation)
                    .product(product)
                    .quantity(1) // Por defecto 1 de cada ingrediente
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
     * Obtiene el carrito activo de un cliente
     */
    @Transactional(readOnly = true)
    public CartResponse getActiveCart(String clientEmail) {
        log.info("Obteniendo carrito activo para cliente: {}", clientEmail);

        OrderBy cart = orderByRepository
                .findByClientEmailAndState(clientEmail, OrderState.UNPAID)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe un carrito activo para el cliente " + clientEmail
                ));

        return CartMapper.toCartResponse(cart);
    }

    /**
     * Obtiene un carrito por su ID
     */
    @Transactional(readOnly = true)
    public CartResponse getCartById(Long orderId) {
        log.info("Obteniendo carrito con ID: {}", orderId);

        OrderBy cart = orderByRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Carrito con ID " + orderId + " no encontrado"
                ));

        return CartMapper.toCartResponse(cart);
    }

    /**
     * Actualiza la cantidad de un item en el carrito
     */
    @Transactional
    public CartResponse updateCartItemQuantity(Long orderId, Long itemId, UpdateCartItemRequest request) {
        log.info("Actualizando cantidad del item {} en carrito {}", itemId, orderId);

        // Validar orden
        OrderBy cart = orderByRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Carrito con ID " + orderId + " no encontrado"
                ));

        // Validar que esté en estado UNPAID
        if (cart.getState() != OrderState.UNPAID) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede modificar un carrito en estado " + cart.getState()
            );
        }

        // Buscar item
        OrderHasCreations item = orderHasCreationsRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item con ID " + itemId + " no encontrado"
                ));

        // Verificar que pertenece a esta orden
        if (!item.getOrder().getId().equals(orderId)) {
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
    public CartResponse removeCartItem(Long orderId, Long itemId) {
        log.info("Eliminando item {} del carrito {}", itemId, orderId);

        // Validar orden
        OrderBy cart = orderByRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Carrito con ID " + orderId + " no encontrado"
                ));

        // Validar estado
        if (cart.getState() != OrderState.UNPAID) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede modificar un carrito en estado " + cart.getState()
            );
        }

        // Buscar item
        OrderHasCreations item = orderHasCreationsRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item con ID " + itemId + " no encontrado"
                ));

        // Verificar pertenencia
        if (!item.getOrder().getId().equals(orderId)) {
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
    public void clearCart(Long orderId) {
        log.info("Vaciando carrito {}", orderId);

        OrderBy cart = orderByRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Carrito con ID " + orderId + " no encontrado"
                ));

        if (cart.getState() != OrderState.UNPAID) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede modificar un carrito en estado " + cart.getState()
            );
        }

        orderHasCreationsRepository.deleteAll(cart.getCreations());
        cart.getCreations().clear();
        orderByRepository.save(cart);

        log.info("Carrito vaciado exitosamente");
    }

    //Finaliza la compra: asigna dirección, método de pago y cambia estado (UNPAID → IN_QUEUE)
    @Transactional
    public OrderByResponse checkout(Long orderId, CheckoutRequest request) {
        log.info("Finalizando compra del carrito {}", orderId);

        OrderBy cart = orderByRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Carrito con ID " + orderId + " no encontrado"
                ));

        // Validar estado
        if (cart.getState() != OrderState.UNPAID) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Solo se pueden finalizar carritos en estado UNPAID"
            );
        }

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

        // El método de pago se puede mostrar en frontend pero no lo guardamos en BD
        // Si quisieras guardarlo, tendrías que agregar un campo en OrderBy
        log.info("Método de pago seleccionado: {}", request.getPaymentMethod());

        // Cambiar estado a IN_QUEUE
        cart.setState(OrderState.IN_QUEUE);
        orderByRepository.save(cart);

        log.info("Compra finalizada exitosamente. Orden en cola de preparación");

        return OrderByMapper.toOrderByDto(cart);
    }
}