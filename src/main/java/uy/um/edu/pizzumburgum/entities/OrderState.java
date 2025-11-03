package uy.um.edu.pizzumburgum.entities;

public enum OrderState {
    UNPAID,
    PROCESSING_PAYMENT,
    IN_QUEUE,
    MAKING,
    DELIVERING,
    DELIVERED,
    CANCELLED,
    ON_HOLD
}
