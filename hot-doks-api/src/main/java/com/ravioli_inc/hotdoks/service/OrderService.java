package com.ravioli_inc.hotdoks.service;

import com.ravioli_inc.hotdoks.model.Order;
import com.ravioli_inc.hotdoks.model.enums.OrderStatus;

import java.util.List;
import java.util.Optional;

public interface OrderService {


    /**
     * Find all orders
     * @return List of all orders
     */
    List<Order> findAll();

    /**
     * Find an order by its ID
     * @param id The order ID
     * @return The order if found
     */
    Optional<Order> findById(Long id);

    /**
     * Save an order
     * @param order The order to save
     * @return The saved order
     */
    Order save(Order order);

    /**
     * Delete an order by its ID
     * @param id The order ID
     */
    void deleteById(Long id);

    /**
     * Update the status of an order
     * @param id
     * @param orderStatus
     * @return
     */
    Optional<Order> updateOrderStatus(Long id, OrderStatus orderStatus);

    /**
     * Find orders by their status
     * @param status The order status
     * @return List of orders with the specified status
     */
    List<Order> findByStatus(OrderStatus status);

    /**
     * Find orders by customer name
     * @param orderedBy The customer name
     * @return List of orders for the specified customer
     */
    List<Order> findByOrderedBy(String orderedBy);

    /**
     * Find orders with filtering and pagination
     * @param orderDate Date in DDMMYYYY format
     * @param status The order status
     * @return List of filtered orders
     */
    List<Order> findOrdersFiltered(String orderDate, OrderStatus status);

    /**
     * Get the next order to prepare
     * @param user The user who will prepare the order
     * @return The next order to prepare, or empty if no orders are waiting
     */
    Optional<Order> getNextOrderToPrepare(String user);

    /**
     * Update the status of an order
     * @param id The order ID
     * @param status The new status to apply
     * @return The updated order
     */
    Order updateStatus(Long id, OrderStatus status);
}
