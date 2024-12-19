package com.ravioli_inc.hotdoks.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        CachedBodyHttpServletRequest cachedBodyHttpServletRequest = new CachedBodyHttpServletRequest(request);
        String requestBody = new String(cachedBodyHttpServletRequest.getCachedBody(), StandardCharsets.UTF_8);
        
        // Only pretty print if it's valid JSON
        if (!requestBody.isEmpty() && requestBody.trim().startsWith("{")) {
            try {
                Object json = objectMapper.readValue(requestBody, Object.class);
                requestBody = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(json);
            } catch (Exception e) {
                // If it's not valid JSON, keep the original string
            }
        }
        
        logger.info("Request: {} {}", cachedBodyHttpServletRequest.getMethod(), cachedBodyHttpServletRequest.getRequestURI());
        logger.info("Request Body:\n{}", requestBody);
        logger.info("Remote Address: {}", request.getRemoteAddr());
        logger.info("Origin: {}", request.getHeader("Origin"));
        
        filterChain.doFilter(cachedBodyHttpServletRequest, response);
        
        logger.info("Response Status: {}", response.getStatus());
    }
}