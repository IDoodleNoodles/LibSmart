package com.example.firstspringbootapp.dto;

public record BookSummaryResponse(
	Long id,
	String title,
	String author,
	String isbn,
	String coverBase64,
	CategoryResponse category,
	BranchResponse branch
) {
}
