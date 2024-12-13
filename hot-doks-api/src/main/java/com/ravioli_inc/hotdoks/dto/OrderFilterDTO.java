package com.ravioli_inc.hotdoks.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Filter parameters for retrieving orders")
public class OrderFilterDTO {
    
    @Schema(description = "Date of the order in DDMMYYYY format", example = "03122024")
    private String orderDate;
    
    @Schema(description = "Starting index for pagination", example = "0", defaultValue = "0")
    private Integer startIndex = 0;
    
    @Schema(description = "Number of items per page", example = "10", defaultValue = "10")
    private Integer pageLength = 10;
}
