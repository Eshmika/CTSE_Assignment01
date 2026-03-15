package com.example.paymentservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private String orderId;

    private BigDecimal amount;

    @Builder.Default
    private String status = "PENDING";

    private String reference;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public String getStatus() {
        return status == null ? "PENDING" : status;
    }
}
