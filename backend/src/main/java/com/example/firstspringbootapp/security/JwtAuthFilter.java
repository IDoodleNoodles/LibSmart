package com.example.firstspringbootapp.security;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;

	public JwtAuthFilter(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String path = request.getRequestURI();
		return path.startsWith("/api/auth/") || "OPTIONS".equalsIgnoreCase(request.getMethod());
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
		throws ServletException, IOException {
		String header = request.getHeader("Authorization");
		if (header == null || !header.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = header.substring(7);
		if (!jwtUtil.isTokenValid(token)) {
			filterChain.doFilter(request, response);
			return;
		}

		if (SecurityContextHolder.getContext().getAuthentication() == null) {
			AuthenticatedUser principal = new AuthenticatedUser(
				jwtUtil.extractUserId(token),
				jwtUtil.extractUsername(token),
				jwtUtil.extractRole(token)
			);
			UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
				principal,
				null,
				List.of(new SimpleGrantedAuthority("ROLE_" + principal.role().name()))
			);
			authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}

		filterChain.doFilter(request, response);
	}
}