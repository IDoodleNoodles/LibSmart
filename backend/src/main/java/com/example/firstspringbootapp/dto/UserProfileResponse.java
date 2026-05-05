package com.example.firstspringbootapp.dto;

import java.time.LocalDateTime;

import com.example.firstspringbootapp.model.Role;

public record UserProfileResponse(
	Long id,
	String username,
	String email,
	String fullName,
	String phone,
	String address,
	Role role,
	LocalDateTime createdAt,
	boolean hasProfilePhoto
) {
}