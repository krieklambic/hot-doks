package com.ravioli_inc.hotdoks.model.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Type of payment for an order")
public enum PaymentType {
    @Schema(description = "Cash payment")
    CASH,
    
    @Schema(description = "Card payment")
    CARD
}
