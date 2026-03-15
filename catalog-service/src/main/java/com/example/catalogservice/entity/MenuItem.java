package com.example.catalogservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {
    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private String name;

    private String description;

    private BigDecimal price;

    @Builder.Default
    private String availability = "AVAILABLE";

    private String category;
    private String imageUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public String getAvailability() {
        return availability == null ? "AVAILABLE" : availability;
    }
}
