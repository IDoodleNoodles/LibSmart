package com.example.firstspringbootapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
	@NotBlank(message = "Username is required")
	String username,

	@NotBlank(message = "Email is required")
	@Email(message = "Email must be valid")
	String email,

	@NotBlank(message = "Full name is required")
	String fullName,

	String phone,

	String address
) {
}