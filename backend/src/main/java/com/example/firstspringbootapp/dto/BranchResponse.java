package com.example.firstspringbootapp.dto;

import java.time.LocalDateTime;

public record BranchResponse(
	Long id,
	String name,
	String location,
	LocalDateTime createdAt
) {
}
