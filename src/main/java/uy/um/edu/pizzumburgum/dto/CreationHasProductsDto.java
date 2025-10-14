package uy.um.edu.pizzumburgum.dto;

import jakarta.persistence.*;
import uy.um.edu.pizzumburgum.entities.Creation;
import uy.um.edu.pizzumburgum.entities.Product;

public class CreationHasProductsDto {
    @Id
    private Long id;

    private int quantity;

    private Creation creation;

    private Product product;
}
