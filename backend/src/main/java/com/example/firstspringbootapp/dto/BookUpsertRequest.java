package com.example.firstspringbootapp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BookUpsertRequest(
	@NotBlank(message = "Title is required")
	String title,

	@NotBlank(message = "Author is required")
	String author,

	String isbn,
	String description,
	Long categoryId,
	Long branchId,

	@NotNull(message = "Quantity is required")
	@Min(value = 0, message = "Quantity must be zero or greater")
	Integer quantity
) {
}
