package com.example.orderservice.config;

import com.example.orderservice.util.JwtTokenValidator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class SecurityConfig {
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    private final JwtTokenValidator jwtTokenValidator;

    public SecurityConfig(JwtTokenValidator jwtTokenValidator) {
        this.jwtTokenValidator = jwtTokenValidator;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                        .permitAll()
                        .anyRequest()
                        .access((authentication,
                                context) -> new AuthorizationDecision(isAuthenticatedRequest(context))))
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(401);
                    response.setContentType("application/json");
                    response.getWriter()
                            .write("{\"error\":\"Unauthorized\",\"message\":\"Valid Bearer token is required\"}");
                }));

        return http.build();
    }

    private boolean isAuthenticatedRequest(RequestAuthorizationContext context) {
        HttpServletRequest request = context.getRequest();

        // Requests from API Gateway carry user identity headers after gateway JWT
        // validation.
        if (StringUtils.hasText(request.getHeader("X-User-Id"))) {
            logger.debug("Authenticated via gateway identity headers for {} {}", request.getMethod(),
                    request.getRequestURI());
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            logger.debug("Denied request due to missing/invalid Authorization header for {} {}", request.getMethod(),
                    request.getRequestURI());
            return false;
        }

        String token = authHeader.substring(7);
        boolean valid = jwtTokenValidator.validateToken(token);
        if (!valid) {
            logger.warn("Denied request due to invalid/expired Bearer token for {} {}", request.getMethod(),
                    request.getRequestURI());
        }
        return valid;
    }
}
