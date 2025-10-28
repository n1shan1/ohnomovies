package com.ohnomovies.backend.config;


import com.ohnomovies.backend.model.entity.User;
import com.ohnomovies.backend.model.types.Role;
import com.ohnomovies.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@email.com";

        // 1. Check if the admin user already exists
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            log.info("Admin user not found, creating initial admin...");

            // 2. Create the User object
            User adminUser = new User();
            adminUser.setFirstName("admin");
            adminUser.setLastName("admin");
            adminUser.setEmail(adminEmail);
            // 3. IMPORTANT: Encode the password
            adminUser.setPasswordHash(passwordEncoder.encode("admin1234"));
            adminUser.setRole(Role.ROLE_ADMIN);

            // 4. Save the user
            userRepository.save(adminUser);
            log.info("Initial admin user created successfully with email: {}", adminEmail);
        } else {
            log.info("Admin user already exists, skipping creation.");
        }
    }
}
