package com.ravioli_inc.hotdoks.model.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Status types for hotdog orders")
public enum OrderStatus {
    @Schema(description = "Order has been placed but preparation hasn't started")
    ORDERED,
    
    @Schema(description = "Order is currently being prepared")
    IN_PREPARATION,
    
    @Schema(description = "Order is ready for pickup")
    READY
}
