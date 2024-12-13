package com.ravioli_inc.hotdoks.model.enums;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
@Schema(description = "Types of hotdogs available")
public enum HotdogType {
    @Schema(description = "Classic hotdog with standard toppings", example = "CLASSIC")
    CLASSIC(7f),
    
    @Schema(description = "Alsatian style hotdog with special toppings", example = "ALSACE")
    ALSACE(8.0f),
    
    @Schema(description = "New York style hotdog with specific toppings", example = "NEWYORK")
    NEWYORK(8.0f);

    private final float price;

    HotdogType(float price) {
        this.price = price;
    }
}
