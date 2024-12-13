package com.ravioli_inc.hotdoks.repository;

import com.ravioli_inc.hotdoks.model.Order;
import com.ravioli_inc.hotdoks.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o ORDER BY o.orderTime DESC, o.preparationTime DESC")
    List<Order> findAllOrdered();
    
    @Query(value = "SELECT * FROM orders o WHERE o.order_status = :status ORDER BY o.order_time DESC, o.preparation_time DESC", nativeQuery = true)
    List<Order> findByStatus(@Param("status") String status);
    
    @Query("SELECT o FROM Order o WHERE o.orderedBy = ?1 ORDER BY o.orderTime DESC, o.preparationTime DESC")
    List<Order> findByOrderedBy(String orderedBy);

    @Query(value = "SELECT * FROM orders o WHERE " +
           "(:orderDate IS NULL OR TO_CHAR(DATE(o.order_time), 'DDMMYYYY') = :orderDate) " +
           "AND (:status IS NULL OR o.order_status = :status) " +
           "ORDER BY o.order_time DESC, o.preparation_time DESC",
           nativeQuery = true)
    List<Order> findOrdersFiltered(@Param("orderDate") String orderDate, @Param("status") String status);

    @Query(value = "SELECT * FROM orders o WHERE o.order_status = 'ORDERED' ORDER BY o.order_time ASC LIMIT 1 FOR UPDATE SKIP LOCKED", nativeQuery = true)
    Optional<Order> findNextOrderToPrepare();
}
