package com.example.firstspringbootapp.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.firstspringbootapp.model.Role;
import com.example.firstspringbootapp.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final String secret;
	private final long expirationMs;

	public JwtUtil(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long expirationMs) {
		this.secret = secret;
		this.expirationMs = expirationMs;
	}

	public String generateToken(User user) {
		Map<String, Object> claims = new LinkedHashMap<>();
		claims.put("userId", user.getId());
		claims.put("username", user.getUsername());
		claims.put("role", user.getRole().name());

		return Jwts.builder()
			.setClaims(claims)
			.setSubject(user.getUsername())
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + expirationMs))
			.signWith(getSigningKey(), SignatureAlgorithm.HS256)
			.compact();
	}

	public Claims extractClaims(String token) {
		return Jwts.parserBuilder()
			.setSigningKey(getSigningKey())
			.build()
			.parseClaimsJws(token)
			.getBody();
	}

	public boolean isTokenValid(String token) {
		try {
			extractClaims(token);
			return true;
		} catch (Exception ex) {
			return false;
		}
	}

	public Long extractUserId(String token) {
		Object userId = extractClaims(token).get("userId");
		if (userId instanceof Number number) {
			return number.longValue();
		}
		return Long.valueOf(String.valueOf(userId));
	}

	public String extractUsername(String token) {
		return extractClaims(token).get("username", String.class);
	}

	public Role extractRole(String token) {
		String role = extractClaims(token).get("role", String.class);
		return Role.valueOf(role);
	}

	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}
}