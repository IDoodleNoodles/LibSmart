package com.example.firstspringbootapp.config;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RequestTimingFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RequestTimingFilter.class);
    private static final long SLOW_MS = 200; // warn if >200ms

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        long start = System.nanoTime();
        try {
            filterChain.doFilter(request, response);
        } finally {
            long durationMs = (System.nanoTime() - start) / 1_000_000;
            String path = request.getMethod() + " " + request.getRequestURI();
            if (durationMs > SLOW_MS) {
                logger.warn("Slow request: {} took {} ms (status={})", path, durationMs, response.getStatus());
            } else {
                logger.debug("Request: {} took {} ms (status={})", path, durationMs, response.getStatus());
            }
        }
    }
}
