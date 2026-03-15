package com.example.authservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private String username;

    private String email;

    private String passwordHash;

    private String fullName;

    @Builder.Default
    private Role role = Role.CUSTOMER;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Builder.Default
    private boolean active = true;

    public Role getRole() {
        return role == null ? Role.CUSTOMER : role;
    }
}
