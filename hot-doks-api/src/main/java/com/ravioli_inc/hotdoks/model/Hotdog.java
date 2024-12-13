package com.ravioli_inc.hotdoks.model;

import com.ravioli_inc.hotdoks.model.enums.HotdogType;
import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Schema(description = "Hotdog entity representing a customizable hotdog order")
@Data
@Entity
@Table(name = "hotdogs")
public class Hotdog {

    @Schema(description = "Unique identifier of the hotdog", example = "1")
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_hotdog")
    @SequenceGenerator(name = "seq_hotdog", sequenceName = "seq_hotdog", allocationSize = 1)
    private Long id;

    @Schema(description = "Type of hotdog", example = "CLASSIC", required = true)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HotdogType type;

    @Schema(description = "Whether the hotdog includes ketchup", example = "true", defaultValue = "false")
    private boolean withKetchup;

    @Schema(description = "Whether the hotdog includes mustard", example = "true", defaultValue = "false")
    private boolean withMustard;

    @Schema(description = "Whether the hotdog includes mayonnaise", example = "true", defaultValue = "false")
    private boolean withMayo;

    @Schema(description = "Whether the hotdog includes onions", example = "true", defaultValue = "false")
    private boolean withOnions;

    @Schema(description = "Whether the hotdog is vegetarian", example = "false", defaultValue = "false")
    private boolean isVege = false;

    @Schema(description = "Additional comments or special instructions for the hotdog", example = "Extra crispy onions please")
    private String comment;

    @Schema(description = "The order this hotdog belongs to")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    @Schema(description = "The price of the hotdog", example = "7.5")
    @Column(nullable = false)
    private Float price;

    public Float computePriceFromType() {
        return type.getPrice();
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }
}
