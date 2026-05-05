package com.example.firstspringbootapp.dto;

import com.example.firstspringbootapp.model.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AdminUserCreateRequest(
	@NotBlank(message = "Username is required")
	String username,

	@NotBlank(message = "Email is required")
	@Email(message = "Email must be valid")
	String email,

	@NotBlank(message = "Password is required")
	String password,

	@NotBlank(message = "Full name is required")
	String fullName,

	String phone,
	String address,
	Role role
) {
}
