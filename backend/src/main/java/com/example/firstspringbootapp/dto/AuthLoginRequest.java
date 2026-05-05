package com.example.firstspringbootapp.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public record AuthLoginRequest(
	@JsonAlias({"username", "email", "usernameOrEmail"})
	@NotBlank(message = "Username or email is required")
	String identifier,

	@NotBlank(message = "Password is required")
	String password
) {
}