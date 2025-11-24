package uy.um.edu.pizzumburgum.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import uy.um.edu.pizzumburgum.dto.request.*;
import uy.um.edu.pizzumburgum.dto.response.CartCheckoutResponse;
import uy.um.edu.pizzumburgum.dto.response.CartResponse;
import uy.um.edu.pizzumburgum.dto.response.CreationResponse;
import uy.um.edu.pizzumburgum.dto.response.OrderByResponse;
import uy.um.edu.pizzumburgum.entities.*;
import uy.um.edu.pizzumburgum.mapper.AddressMapper;
import uy.um.edu.pizzumburgum.mapper.CartMapper;
import uy.um.edu.pizzumburgum.mapper.CreationMapper;
import uy.um.edu.pizzumburgum.mapper.OrderByMapper;
import uy.um.edu.pizzumburgum.repository.*;

import java.time.LocalDateTime;
import java.util.*;
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

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private PaymentService paymentService;

    //Agrega una creación personalizada al carrito: si no existe carrito activo, lo crea (SIN DIRECCIÓN todavía)
    @Transactional
    public CartResponse addToCart(AddToCartRequest request, String clientEmail) {
        log.info("Agregando item al carrito para cliente: {}", clientEmail);

        // Buscar o crear carrito activo
        OrderBy cart = this.getActiveCart(clientEmail);

        // Validar productos
        Set<Product> products = new HashSet<>();
        Set<CreationHasProducts> creationHasProducts = new HashSet<>();

        for (CreationHasProductsRequest creationHasProductsRequest : request.getProducts()) {
            Long productId = creationHasProductsRequest.getProductId();
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Producto con ID " + productId + " no encontrado"
                    ));
            if (!product.getAvailable()){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto " + product.getName() + " no esta disponible");
            }

            products.add(product);

            creationHasProducts.add(CreationHasProducts.builder()
                    .quantity(creationHasProductsRequest.getQuantity())
                    .product(product)
                    .build());
        }

        // Crear nombre según tipo
        String creationName = switch (request.getType()) {
            case PIZZA -> "Pizza Personalizada";
            case HAMBURGER -> "Hamburguesa Personalizada";
            case EXTRA -> creationHasProducts.stream()
                    .findFirst()
                    .map(chp -> chp.getProduct().getName())
                    .orElse("Producto Extra");
        };

        // Buscar si ya existe una creacion con los mismos productos
        Map<Long, Integer> requestedProductsMap = request.getProducts().stream()
                .collect(Collectors.toMap(
                        CreationHasProductsRequest::getProductId,
                        CreationHasProductsRequest::getQuantity
                ));

        Optional<OrderHasCreations> existingCreationOpt = cart.getCreations().stream()
                .filter(orderHasCreations ->
                        orderHasCreations.getCreation().getType() == request.getType())
                .filter(orderHasCreations -> {
                    Map<Long, Integer> existingProductsMap = orderHasCreations.getCreation().getProducts().stream()
                            .collect(Collectors.toMap(
                                    chp -> chp.getProduct().getId(),
                                    CreationHasProducts::getQuantity
                            ));
                    return existingProductsMap.equals(requestedProductsMap);
                })
                .findFirst();


        if (existingCreationOpt.isPresent()) {
            OrderHasCreations existing = existingCreationOpt.get();
            int oldQty = existing.getQuantity();
            int newQty = oldQty + request.getQuantity();
            existing.setQuantity(newQty);
            orderHasCreationsRepository.save(existing);

            return CartMapper.toCartResponse(cart);
        }


        // Crear Creation nueva
        Creation creation = Creation.builder()
                .name(creationName)
                .type(request.getType())
                .products(new HashSet<>())
                .order(new HashSet<>())
                .available(true)
                .build();

        creation = creationRepository.save(creation);

        // Vincular productos
        for (CreationHasProducts chpItem : creationHasProducts) {
            CreationHasProducts chp = CreationHasProducts.builder()
                    .creation(creation)
                    .product(chpItem.getProduct())
                    .quantity(chpItem.getQuantity())
                    .build();
            creationHasProductsRepository.save(chp);
            creation.getProducts().add(chp);
        }

        // Crear OrderHasCreations
        OrderHasCreations cartItem = OrderHasCreations.builder()
                .order(cart)
                .creation(creation)
                .quantity(request.getQuantity())
                .build();

        cartItem = orderHasCreationsRepository.save(cartItem);
        cart.getCreations().add(cartItem);

        log.info("Item agregado al carrito exitosamente");

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

        CreationResponse creationResponse = CreationMapper.toCreationDto(creation);

        if (!creationResponse.getAvailable()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede agregar '" + creation.getName() + "' debido a que uno de los productos no esta disponible.");
        }

        OrderHasCreations cartItem = OrderHasCreations.builder()
                .order(cart)
                .creation(creation)
                .quantity(request.getQuantity())
                .build();

        cartItem = orderHasCreationsRepository.save(cartItem);

        cart.getCreations().add(cartItem);

        cart = orderByRepository.save(cart);

        log.info("Creation {} agregada al carrito exitosamente", creation.getId());

        return CartMapper.toCartResponse(cart);
    }

    /**
     * Obtiene el carrito activo de un cliente
     */
    @Transactional
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

    public CartCheckoutResponse checkout(String clientEmail, CheckoutRequest request) throws InterruptedException {
        OrderBy cart = getActiveCart(clientEmail);
        cart.setState(OrderState.PROCESSING_PAYMENT);
        orderByRepository.saveAndFlush(cart);

        try {
            return doCheckout(cart, clientEmail, request);
        } catch (Exception e) {
            log.error("Error durante el checkout del cliente {}: {}", clientEmail, e.getMessage());

            try {
                cart.setState(OrderState.UNPAID);
                orderByRepository.saveAndFlush(cart);
            } catch (Exception restoreEx) {
                log.error("No se pudo restaurar el carrito a UNPAID: {}", restoreEx.getMessage());
            }

            throw e;
        }
    }

    //Finaliza la compra: asigna dirección, metodo de pago y cambia estado (UNPAID → IN_QUEUE)
    @Transactional
    protected CartCheckoutResponse doCheckout(OrderBy cart, String clientEmail, CheckoutRequest request) throws InterruptedException {
        log.info("Pagando compra del carrito del usuario {}", clientEmail);

        Address deliveryAddress = null;
        Card card = null;
        OrderByResponse orderResponse = null;
        String paymentStatus = null;
        // Validar que tenga items
        if (cart.getCreations() == null || cart.getCreations().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede pagar un carrito vacío"
            );
        }
        try{
            deliveryAddress = addressRepository.findByClientEmailAndActiveTrueAndDeletedFalse(clientEmail);
        } catch (Exception e){
            log.error(e.getMessage());
        }

        if (deliveryAddress == null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El cliente no tiene ninguna direccion activa"
            );
        }

        // Asignar dirección de entrega
        cart.setAddress(deliveryAddress);

        // Asignar el extra
        cart.setExtraAmount(request.getExtraAmount());

        // Agregar las notas
        cart.setNotes(request.getNotes());

        // Setear los precios de todos las creaciones (OrderHasCreations)
        cart.getCreations().stream()
                .peek(c -> {
                    CreationResponse creationResponse = CreationMapper.toCreationDto(c.getCreation());
                    if (!creationResponse.getAvailable()){
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "No se pudo realizar el pago, existe una creacion no disponible"
                        );
                    }
                    c.setPrice(creationResponse.getPrice());
                })
                .forEach(orderHasCreationsRepository::save);

        // El metodo de pago se puede mostrar en frontend pero no lo guardamos en BD
        // Si quisieras guardarlo, tendrías que agregar un campo en OrderBy

        try{
            card = cardRepository.findByClientEmailAndActiveTrueAndDeletedFalse(clientEmail);
        } catch (Exception e){
            log.error(e.getMessage());
        }

        if (card == null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El cliente no tiene ninguna tarjeta activa"
            );
        }

        orderResponse = OrderByMapper.toOrderByDto(cart);

        // Realizar el pago con stripe
        Map<String , Object> paymentResult = paymentService.createPaymentIntent(
                clientEmail,
                card.getId(),
                orderResponse.getTotalPrice(),
                request.getCurrency(),
                clientEmail
        );

        // Verificar que el pago fue exitoso
        paymentStatus = (String) paymentResult.get("status");
        if (!"succeeded".equals(paymentStatus)) {
            throw new ResponseStatusException(
                    HttpStatus.PAYMENT_REQUIRED,
                    "El pago no pudo ser procesado. Estado: " + paymentStatus
            );
        }

        log.info("SE REALIZO UN PAGO DE {} {}", orderResponse.getTotalPrice(), request.getCurrency().toUpperCase());
        // Cambiar estado a IN_QUEUE
        cart.setState(OrderState.IN_QUEUE);

        // Cambiar creacion del pedido
        cart.setDateCreated(LocalDateTime.now());

        orderByRepository.save(cart);

        log.info("Compra finalizada exitosamente. Orden en cola de preparación");
        return CartCheckoutResponse.builder()
                .orderBy(orderResponse)
                .total(orderResponse.getTotalPrice())
                .date(LocalDateTime.now())
                .currency(request.getCurrency())
                .paymentStatus(paymentStatus)
                .address(AddressMapper.toAddressResponse(deliveryAddress))
                .notes(orderResponse.getNotes())
                .build();
    }

    @Transactional
    public CartResponse addExtrasAsCreationsToCart(String clientEmail, AddProductsAsCreationsRequest creationDto) {
        CartResponse cartResponse = null;

        for (CreationHasProductsRequest creationHasProductsRequest : creationDto.getProducts()) {
            Long productId = creationHasProductsRequest.getProductId();

            // Verificar que sea un EXTRA
            Product product = productRepository.findById(productId).orElse(null);

            if (product == null || !product.getCategory().equals(ProductCategory.EXTRA)){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El producto no es de la categoria EXTRA o no existe");
            }

            int quantity = creationHasProductsRequest.getQuantity();

            AddToCartRequest addToCartRequest = AddToCartRequest.builder()
                    .products(Collections.singleton(
                            CreationHasProductsRequest.builder()
                                    .productId(productId)
                                    .quantity(1)
                                    .build()
                    ))
                    .quantity(quantity)
                    .type(CreationType.EXTRA)
                    .build();

            cartResponse = this.addToCart(addToCartRequest, clientEmail);
        }
        return cartResponse;
    }

    private OrderBy getActiveCart(String clientEmail){
        log.info("Obteniendo carrito activo para cliente: {}", clientEmail);

        OrderBy cart = orderByRepository
                .findFirstByClientEmailAndState(clientEmail, OrderState.UNPAID)
                .orElse(null);

        if (cart == null){
            Client client = clientRepository.findById(clientEmail)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Cliente con email " + clientEmail + " no encontrado"
                    ));

            cart = orderByRepository
                    .findFirstByClientEmailAndState(clientEmail, OrderState.UNPAID)
                    .orElseGet(() -> {
                        log.info("No existe carrito activo, creando uno nuevo");

                        OrderBy newCart = OrderBy.builder()
                                .client(client)
                                .state(OrderState.UNPAID)
                                .dateCreated(LocalDateTime.now())
                                .creations(new HashSet<>())
                                .build();
                        return orderByRepository.save(newCart);
                    });
        }

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