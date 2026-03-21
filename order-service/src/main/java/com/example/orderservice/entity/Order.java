package com.example.orderservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private String userId;

    private BigDecimal totalAmount;

    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Builder.Default
    private String status = "CREATED";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public String getStatus() {
        return status == null ? "CREATED" : status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        private String itemId;
        private Integer quantity;
    }
}
