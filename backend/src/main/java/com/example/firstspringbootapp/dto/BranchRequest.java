package com.example.firstspringbootapp.dto;

import jakarta.validation.constraints.NotBlank;

public record BranchRequest(
	@NotBlank(message = "Name is required")
	String name,
	String location
) {
}
