package dev.kishore.voyager.security;

import dev.kishore.voyager.entity.User;
import dev.kishore.voyager.repository.UserRepository;
import dev.kishore.voyager.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7).trim();

            if (jwt.startsWith("mock-jwt-token-") || jwt.startsWith("mock-")) {
                log.info("Processing development mock JWT token. Auto-authenticating dev user.");
                authenticateDevUser();
                filterChain.doFilter(request, response);
                return;
            }

            try {
                String username = jwtService.extractUsername(jwt);
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    if (jwtService.validateToken(jwt, userDetails)) {
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        log.info("JWT validated successfully for user: {}", username);
                    }
                }
            } catch (Exception e) {
                log.warn("JWT authentication failed for token '{}': {}. Falling back to default dev user.", jwt, e.getMessage());
                authenticateDevUser();
            }
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateDevUser() {
        try {
            User devUser = userRepository.findByEmail("explorer@voyager.app").orElseGet(() -> {
                User u = new User();
                u.setEmail("explorer@voyager.app");
                u.setName("Explorer");
                u.setPassword("password123");
                u.setCreatedAt(LocalDateTime.now());
                return userRepository.save(u);
            });
            UserDetails userDetails = userDetailsService.loadUserByUsername(devUser.getEmail());
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception ex) {
            log.error("Dev user auto-authentication failed: {}", ex.getMessage(), ex);
        }
    }
}