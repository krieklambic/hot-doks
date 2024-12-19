package com.ravioli_inc.hotdoks.controller;

import com.ravioli_inc.hotdoks.model.Order;
import com.ravioli_inc.hotdoks.model.enums.OrderStatus;
import com.ravioli_inc.hotdoks.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.util.List;

@Tag(name = "Order Management", description = "Endpoints for managing hotdog orders")
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final ObjectMapper objectMapper = new ObjectMapper()
        .enable(SerializationFeature.INDENT_OUTPUT);

    @Operation(summary = "Create a new order", description = "Creates a new hotdog order with ORDERED status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order created successfully",
            content = @Content(schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "400", description = "Invalid order data provided")
    })
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        try {
            String requestJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(order);
            System.out.println("Request JSON structure:\n" + requestJson);
        } catch (Exception e) {
            System.out.println("Error serializing request: " + e.getMessage());
        }
        Order savedOrder = orderService.save(order);
        try {
            String responseJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(savedOrder);
            System.out.println("Response JSON structure:\n" + responseJson);
        } catch (Exception e) {
            System.out.println("Error serializing response: " + e.getMessage());
        }
        return ResponseEntity.ok(savedOrder);
    }

    @Operation(summary = "Get all orders", description = "Retrieves a list of all orders")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved orders",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Order.class)))),
        @ApiResponse(responseCode = "204", description = "No orders found")
    })
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.findAll();
        /*if (orders.isEmpty()) {
            System.out.println("Response: No orders found");
            return ResponseEntity.ok(orders);
        }*/
        try {
            System.out.println("Response: " + objectMapper.writeValueAsString(orders));
        } catch (Exception e) {
            System.out.println("Error serializing response: " + e.getMessage());
        }
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Get order by ID", description = "Retrieves an order by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the order",
            content = @Content(schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(
            @Parameter(description = "ID of the order to retrieve") @PathVariable Long id) {
        return orderService.findById(id)
            .map(order -> {
                try {
                    System.out.println("Response: " + objectMapper.writeValueAsString(order));
                } catch (Exception e) {
                    System.out.println("Error serializing response: " + e.getMessage());
                }
                return ResponseEntity.ok(order);
            })
            .orElseGet(() -> {
                System.out.println("Response: Order not found");
                return ResponseEntity.notFound().build();
            });
    }

    @Operation(summary = "Get orders by status", description = "Retrieves all orders with a specific status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved orders",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = Order.class)))),
        @ApiResponse(responseCode = "204", description = "No orders found with this status")
    })
    @GetMapping("/status/{orderStatus}")
    public ResponseEntity<List<Order>> getOrdersByStatus(
            @Parameter(description = "Status to filter by") @PathVariable OrderStatus orderStatus) {
        List<Order> orders = orderService.findByStatus(orderStatus);
        if (orders.isEmpty()) {
            System.out.println("Response: No orders found with this status");
            return ResponseEntity.noContent().build();
        }
        try {
            System.out.println("Response: " + objectMapper.writeValueAsString(orders));
        } catch (Exception e) {
            System.out.println("Error serializing response: " + e.getMessage());
        }
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Get filtered orders", description = "Get orders filtered by date and status")
    @GetMapping("/filtered")
    public ResponseEntity<List<Order>> getOrdersFiltered(
            @Parameter(description = "Date in DDMMYYYY format") @RequestParam(required = false) String orderDate,
            @Parameter(description = "Order status") @RequestParam(required = false) OrderStatus status) {
        List<Order> orders = orderService.findOrdersFiltered(orderDate, status);
        /*if (orders.isEmpty()) {
            System.out.println("Response: No orders found");
            return ResponseEntity.noContent().build();
        }*/
        try {
            System.out.println("Response: " + objectMapper.writeValueAsString(orders));
        } catch (Exception e) {
            System.out.println("Error serializing response: " + e.getMessage());
        }
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Get next order to prepare", 
              description = "Retrieves the next order with ORDERED status and marks it as IN_PREPARATION. " +
                          "This endpoint is concurrency-safe and will never return the same order twice.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved next order",
            content = @Content(schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "204", description = "No orders waiting to be prepared")
    })
    @GetMapping("/next-to-prepare")
    public ResponseEntity<Order> getNextOrderToPrepare(@RequestParam String user) {
        return orderService.getNextOrderToPrepare(user)
            .map(order -> {
                try {
                    System.out.println("Response: " + objectMapper.writeValueAsString(order));
                } catch (Exception e) {
                    System.out.println("Error serializing response: " + e.getMessage());
                }
                return ResponseEntity.ok(order);
            })
            .orElseGet(() -> {
                System.out.println("Response: No orders waiting to be prepared");
                return ResponseEntity.noContent().build();
            });
    }

    @Operation(summary = "Delete order", description = "Deletes an order by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Order successfully deleted"),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(
            @Parameter(description = "ID of the order to delete") @PathVariable Long id) {
        orderService.deleteById(id);
        System.out.println("Response: Order deleted successfully");
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update order status", description = "Updates the status of an order")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order status updated successfully",
            content = @Content(schema = @Schema(implementation = Order.class))),
        @ApiResponse(responseCode = "404", description = "Order not found"),
        @ApiResponse(responseCode = "400", description = "Invalid status value")
    })
    @PostMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
        @Parameter(description = "ID of the order to update") @PathVariable Long id,
        @Parameter(description = "New status to apply") @RequestParam OrderStatus status) {
        Order updatedOrder = orderService.updateStatus(id, status);
        try {
            System.out.println("Response: " + objectMapper.writeValueAsString(updatedOrder));
        } catch (Exception e) {
            System.out.println("Error serializing response: " + e.getMessage());
        }
        return ResponseEntity.ok(updatedOrder);
    }
}
