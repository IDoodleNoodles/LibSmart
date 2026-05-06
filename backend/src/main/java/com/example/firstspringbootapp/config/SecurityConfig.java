package com.example.firstspringbootapp.config;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.core.env.Environment;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.firstspringbootapp.security.JwtAuthFilter;

@Configuration
public class SecurityConfig {

	private final JwtAuthFilter jwtAuthFilter;
	private final Environment environment;

	public SecurityConfig(JwtAuthFilter jwtAuthFilter, Environment environment) {
		this.jwtAuthFilter = jwtAuthFilter;
		this.environment = environment;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf(AbstractHttpConfigurer::disable)
			.cors(Customizer.withDefaults())
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/api/auth/**").permitAll()
				.requestMatchers("/api/admin/**").hasRole("ADMIN")
				.requestMatchers("/api/user/**").hasAnyRole("ADMIN", "USER")
				.anyRequest().permitAll()
			)
			.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOriginPatterns(resolveAllowedOriginPatterns());
		configuration.addAllowedHeader("*");
		configuration.addAllowedMethod("*");
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	private List<String> resolveAllowedOriginPatterns() {
		Set<String> originPatterns = new LinkedHashSet<>();
		originPatterns.add("http://localhost:*");
		originPatterns.add("http://127.0.0.1:*");
		originPatterns.add("http://[::1]:*");
		originPatterns.add("https://*.vercel.app");

		addConfiguredOrigins(originPatterns, environment.getProperty("CORS_ALLOWED_ORIGINS"));
		addConfiguredOrigins(originPatterns, environment.getProperty("FRONTEND_URL"));
		addConfiguredOrigins(originPatterns, environment.getProperty("VERCEL_URL"));

		return new ArrayList<>(originPatterns);
	}

	private void addConfiguredOrigins(Set<String> originPatterns, String configuredOrigins) {
		if (configuredOrigins == null || configuredOrigins.isBlank()) {
			return;
		}

		for (String candidate : configuredOrigins.split(",")) {
			String originPattern = candidate.trim();
			if (originPattern.isEmpty()) {
				continue;
			}

			if (!originPattern.contains("://")) {
				originPattern = "https://" + originPattern;
			}

			originPatterns.add(originPattern);
		}
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}