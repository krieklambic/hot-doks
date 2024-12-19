package com.ravioli_inc.hotdoks.service.impl;

import com.ravioli_inc.hotdoks.model.Order;
import com.ravioli_inc.hotdoks.model.Hotdog;
import com.ravioli_inc.hotdoks.model.enums.OrderStatus;
import com.ravioli_inc.hotdoks.repository.HotdogRepository;
import com.ravioli_inc.hotdoks.repository.OrderRepository;
import com.ravioli_inc.hotdoks.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final HotdogRepository hotdogRepository;

    @Override
    public Order save(Order order) {
        if (order.getOrderTime() == null) {
            order.setOrderTime(LocalDateTime.now());
        }
        if (order.getOrderStatus() == null) {
            order.setOrderStatus(OrderStatus.ORDERED);
        }
        List<Hotdog> hotdogs = order.getHotdogs();
        if (hotdogs != null) {
            float totalPrice = 0.0f;
            for (Hotdog hotdog : hotdogs) {
                hotdog.setOrder(order);
                float hotdogPrice = hotdog.computePriceFromType();
                hotdog.setPrice(hotdogPrice);
                totalPrice += hotdogPrice;
                //hotdogRepository.save(hotdog);
            }
            order.setTotalPrice(totalPrice);
        } else {
            order.setTotalPrice(0.0f);
            order.setHotdogs(null);
        }
        
        return orderRepository.save(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findAll() {
        return orderRepository.findAllOrdered();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findByStatus(OrderStatus orderStatus) {
        return orderRepository.findByStatus(orderStatus != null ? orderStatus.toString() : null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findByOrderedBy(String orderedBy) {
        return orderRepository.findByOrderedBy(orderedBy);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> findOrdersFiltered(String orderDate, OrderStatus status) {
        return orderRepository.findOrdersFiltered(orderDate, status != null ? status.toString() : null);
    }

    @Override
    public Optional<Order> updateOrderStatus(Long id, OrderStatus orderStatus) {
        return orderRepository.findById(id)
            .map(order -> {
                order.setOrderStatus(orderStatus);
                if (orderStatus == OrderStatus.IN_PREPARATION) {
                    order.setPreparationTime(LocalDateTime.now());
                }
                return orderRepository.save(order);
            });
    }

    @Override
    public void deleteById(Long id) {
        orderRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Optional<Order> getNextOrderToPrepare(String user) {
        return orderRepository.findNextOrderToPrepare()
            .map(order -> {
                order.setOrderStatus(OrderStatus.IN_PREPARATION);
                order.setPreparedBy(user);
                return orderRepository.save(order);
            });
    }

    @Override
    public Order updateStatus(Long id, OrderStatus status) {
        return orderRepository.findById(id)
            .map(order -> {
                order.setOrderStatus(status);
                if (status == OrderStatus.READY) {
                    order.setPreparationTime(LocalDateTime.now());
                }
                return orderRepository.save(order);
            })
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
}
