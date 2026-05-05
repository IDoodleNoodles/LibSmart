package com.example.firstspringbootapp.dto;

import com.example.firstspringbootapp.model.Role;
import jakarta.validation.constraints.NotNull;

public record RoleUpdateRequest(
	@NotNull(message = "Role is required")
	Role role
) {
}