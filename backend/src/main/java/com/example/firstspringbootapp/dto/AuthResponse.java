package com.example.firstspringbootapp.dto;

import com.example.firstspringbootapp.model.Role;

public record AuthResponse(
	boolean success,
	String message,
	String token,
	Role role,
	UserProfileResponse user
) {
}