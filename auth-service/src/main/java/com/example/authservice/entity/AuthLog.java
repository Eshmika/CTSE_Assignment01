package com.example.authservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "auth_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthLog {

    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private String userId;

    private String action;

    private String ipAddress;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
