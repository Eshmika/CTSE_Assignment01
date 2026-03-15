package com.example.orderservice.service;

import com.example.orderservice.client.CatalogServiceClient;
import com.example.orderservice.dto.CatalogItemResponse;
import com.example.orderservice.dto.CreateOrderRequest;
import com.example.orderservice.dto.OrderResponse;
import com.example.orderservice.entity.Order;
import com.example.orderservice.repository.OrderRepository;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

/**
 * OrderServiceImpl - Placeholder implementation
 * Full implementation will be added during feature development
 */
@Service
public class OrderServiceImpl implements OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired(required = false)
    private OrderRepository orderRepository;

    @Autowired(required = false)
    private CatalogServiceClient catalogServiceClient;

    @Override
    public OrderResponse createOrder(String userId, CreateOrderRequest request) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Unable to resolve authenticated user");
        }
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Order must contain at least one item");
        }
        if (orderRepository == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Order repository is unavailable");
        }
        if (catalogServiceClient == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Catalog service client is unavailable");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<String> invalidItemIds = new ArrayList<>();

        for (CreateOrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            if (itemRequest == null || itemRequest.getItemId() == null || itemRequest.getItemId().isBlank()) {
                throw new ResponseStatusException(BAD_REQUEST, "Each order item must contain itemId");
            }
            if (itemRequest.getQuantity() == null || itemRequest.getQuantity() <= 0) {
                throw new ResponseStatusException(BAD_REQUEST,
                        "Quantity must be greater than zero for item " + itemRequest.getItemId());
            }

            CatalogItemResponse catalogItem;
            try {
                catalogItem = catalogServiceClient.getItem(itemRequest.getItemId());
            } catch (FeignException.NotFound ex) {
                invalidItemIds.add(itemRequest.getItemId());
                continue;
            } catch (FeignException ex) {
                throw new ResponseStatusException(BAD_REQUEST,
                        "Failed to validate item " + itemRequest.getItemId() + " from catalog service", ex);
            }

            if (catalogItem == null || catalogItem.getPrice() == null) {
                invalidItemIds.add(itemRequest.getItemId());
                continue;
            }

            if (catalogItem.getAvailability() != null
                    && !"AVAILABLE".equalsIgnoreCase(catalogItem.getAvailability())) {
                throw new ResponseStatusException(BAD_REQUEST,
                        "Item is not available: " + itemRequest.getItemId());
            }

            BigDecimal lineAmount = catalogItem.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(lineAmount);
        }

        if (!invalidItemIds.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "Invalid items in order: " + String.join(",", invalidItemIds));
        }

        Order order = Order.builder()
                .userId(userId)
                .totalAmount(totalAmount)
                .status("CREATED")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);
        logger.info("Created order {} for user {} with total {}", savedOrder.getId(), userId, totalAmount);
        return toResponse(savedOrder);
    }

    @Override
    public OrderResponse getOrderById(String orderId) {
        if (orderRepository == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Order repository is unavailable");
        }
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Order not found: " + orderId));
        return toResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByUserId(String userId) {
        if (orderRepository == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Order repository is unavailable");
        }
        return orderRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public OrderResponse updateOrderStatus(String orderId, String status) {
        if (status == null || status.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Status is required");
        }
        if (orderRepository == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Order repository is unavailable");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Order not found: " + orderId));

        order.setStatus(status.trim().toUpperCase(Locale.ROOT));
        order.setUpdatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        logger.info("Updated order {} status to {}", orderId, savedOrder.getStatus());
        return toResponse(savedOrder);
    }

    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .build();
    }
}
