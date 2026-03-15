package com.example.authservice.config;

import com.example.authservice.entity.Role;
import com.example.authservice.entity.User;
import com.example.authservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminBootstrapConfig {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapConfig.class);

    @Bean
    public CommandLineRunner createDefaultAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.bootstrap.enabled:true}") boolean enabled,
            @Value("${app.admin.bootstrap.username:admin}") String username,
            @Value("${app.admin.bootstrap.email:admin@local.test}") String email,
            @Value("${app.admin.bootstrap.password:Admin@12345}") String password,
            @Value("${app.admin.bootstrap.full-name:System Admin}") String fullName
    ) {
        return args -> {
            if (!enabled) {
                return;
            }

            try {
                if (userRepository.findByEmail(email).isPresent() || userRepository.findByUsername(username).isPresent()) {
                    return;
                }

                userRepository.save(User.builder()
                        .username(username)
                        .email(email)
                        .fullName(fullName)
                        .passwordHash(passwordEncoder.encode(password))
                        .role(Role.ADMIN)
                        .active(true)
                        .build());
            } catch (Exception ex) {
                // Avoid hard-failing the entire service if DB is temporarily unreachable at startup.
                log.warn("Skipping default admin bootstrap: {}", ex.getMessage());
            }
        };
    }
}
