package com.example.firstspringbootapp.dto;

import java.time.LocalDateTime;

import com.example.firstspringbootapp.model.BookStatus;

public record BookResponse(
	Long id,
	String title,
	String author,
	String isbn,
	String description,
	Integer quantity,
	Integer availableQuantity,
	BookStatus status,
	LocalDateTime createdAt,
	boolean hasCoverImage,
	CategoryResponse category,
	BranchResponse branch
) {
}
