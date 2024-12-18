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

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        logger.info("Request URI: {} {}", request.getMethod(), request.getRequestURI());
        logger.info("Remote Address: {}", request.getRemoteAddr());
        logger.info("Origin: {}", request.getHeader("Origin"));
        
        filterChain.doFilter(request, response);
        
        logger.info("Response Status: {}", response.getStatus());
    }
}