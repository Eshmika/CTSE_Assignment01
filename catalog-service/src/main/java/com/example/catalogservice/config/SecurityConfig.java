package com.example.catalogservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/items")
                        .access((authentication, context) -> new AuthorizationDecision(hasAdminRole(context)))
                        .requestMatchers(HttpMethod.PATCH, "/items/*/availability")
                        .access((authentication, context) -> new AuthorizationDecision(hasAdminRole(context)))
                        .requestMatchers(HttpMethod.DELETE, "/items/*")
                        .access((authentication, context) -> new AuthorizationDecision(hasAdminRole(context)))
                        .requestMatchers("/items", "/items/**", "/catalog/items", "/catalog/items/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/actuator/health")
                        .permitAll()
                        .anyRequest().authenticated());

        return http.build();
    }

    private boolean hasAdminRole(RequestAuthorizationContext context) {
        String rolesHeader = context.getRequest().getHeader("X-User-Roles");
        if (rolesHeader == null || rolesHeader.isBlank()) {
            return false;
        }

        return Arrays.stream(rolesHeader.split(","))
                .map(String::trim)
                .anyMatch(role -> "ADMIN".equalsIgnoreCase(role) || "ROLE_ADMIN".equalsIgnoreCase(role));
    }
}
