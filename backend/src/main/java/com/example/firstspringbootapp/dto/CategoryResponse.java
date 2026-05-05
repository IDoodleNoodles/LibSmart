package com.example.firstspringbootapp.dto;

import java.time.LocalDateTime;

public record CategoryResponse(
	Long id,
	String name,
	String description,
	LocalDateTime createdAt
) {
}
