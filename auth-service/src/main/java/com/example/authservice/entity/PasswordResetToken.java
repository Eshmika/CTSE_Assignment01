package com.example.authservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "password_reset_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {

    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private User user;

    private String token;

    private LocalDateTime expiryDate;

    private boolean used;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
