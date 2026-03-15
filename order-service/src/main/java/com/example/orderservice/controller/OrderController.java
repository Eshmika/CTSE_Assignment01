package com.example.orderservice.controller;

import com.example.orderservice.dto.CreateOrderRequest;
import com.example.orderservice.dto.OrderResponse;
import com.example.orderservice.service.OrderService;
import com.example.orderservice.util.JwtTokenValidator;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

/**
 * OrderController - Placeholder implementation
 * Details will be implemented during feature development
 */
@RestController
@RequestMapping
@Tag(name = "Orders", description = "Order management endpoints")
public class OrderController {

    @Autowired(required = false)
    private OrderService orderService;

    @Autowired(required = false)
    private JwtTokenValidator jwtTokenValidator;

    @PostMapping
    @Operation(summary = "Create order", description = "Create a new order (requires authentication)")
    @ApiResponse(responseCode = "201", description = "Order created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    public ResponseEntity<OrderResponse> createOrder(
            @RequestHeader(value = "X-User-Id", required = false) String gatewayUserId,
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody CreateOrderRequest request) {
        String userId = resolveUserId(gatewayUserId, authorization);
        return ResponseEntity.status(201).body(orderService.createOrder(userId, request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieve a specific order (requires authentication)")
    @ApiResponse(responseCode = "200", description = "Order found")
    @ApiResponse(responseCode = "404", description = "Order not found")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my orders", description = "Retrieve all orders for the current user (requires authentication)")
    @ApiResponse(responseCode = "200", description = "List of orders returned")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @RequestHeader(value = "X-User-Id", required = false) String gatewayUserId,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        String userId = resolveUserId(gatewayUserId, authorization);
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update order status", description = "Update the status of an order (ADMIN)")
    @ApiResponse(responseCode = "200", description = "Status updated")
    @ApiResponse(responseCode = "404", description = "Order not found")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable String id,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    private String resolveUserId(String gatewayUserId, String authorization) {
        if (StringUtils.hasText(gatewayUserId)) {
            return gatewayUserId;
        }

        if (StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")
                && jwtTokenValidator != null) {
            String token = authorization.substring(7);
            if (jwtTokenValidator.validateToken(token)) {
                String userId = jwtTokenValidator.extractUserId(token);
                if (StringUtils.hasText(userId)) {
                    return userId;
                }
            }
        }

        throw new ResponseStatusException(BAD_REQUEST,
                "Unable to resolve user id from request headers or token");
    }
}
