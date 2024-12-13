package com.ravioli_inc.hotdoks.model;

import com.ravioli_inc.hotdoks.model.enums.OrderStatus;
import com.ravioli_inc.hotdoks.model.enums.PaymentType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Schema(description = "Order entity representing a customer's hotdog order")
@Getter
@Setter
@Entity
@Table(name = "orders")  // "order" is a reserved keyword in SQL
public class Order {

    @Schema(description = "Unique identifier of the order", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_order")
    @SequenceGenerator(name = "seq_order", sequenceName = "seq_order", allocationSize = 1)
    private Long id;

    @Schema(description = "Current status of the order", example = "IN_PREPARATION", required = true)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus orderStatus;

    @Schema(description = "Name of the person who placed the order", example = "John Doe", required = true)
    @Column(nullable = false)
    private String orderedBy;

    @Schema(description = "Name of the staff member preparing the order", example = "Chef Mike")
    private String preparedBy;

    @Schema(description = "Time when the order was placed", example = "2023-08-15T14:30:00")
    private LocalDateTime orderTime;

    @Schema(description = "Time when the order preparation started", example = "2023-08-15T14:35:00")
    private LocalDateTime preparationTime;

    @Schema(description = "Customer's name for the order", example = "Jane Smith")
    private String customerName;

    @Schema(description = "Type of payment for the order", example = "CARD")
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    @Schema(description = "The total price of the order", example = "47.5")
    public Float totalPrice;

    @Schema(description = "List of hotdogs in the order")
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Hotdog> hotdogs = new ArrayList<>();

    public void setHotdogs(List<Hotdog> hotdogs) {
        this.hotdogs.clear();
        if (hotdogs != null) {
            hotdogs.forEach(this::addHotdog);
        }
    }

    public void addHotdog(Hotdog hotdog) {
        if (hotdog != null) {
            hotdogs.add(hotdog);
            hotdog.setOrder(this);
        }
    }

    public void removeHotdog(Hotdog hotdog) {
        if (hotdog != null && hotdogs.remove(hotdog)) {
            hotdog.setOrder(null);
        }
    }

    @Schema(description = "Time in minutes between order time and preparation time", example = "5")
    @Transient
    public Integer getPreparationMinutes() {
        if (orderTime == null || preparationTime == null) {
            return null;
        }
        return Math.toIntExact(Math.round(
            java.time.Duration.between(orderTime, preparationTime).getSeconds() / 60.0
        ));
    }
}
