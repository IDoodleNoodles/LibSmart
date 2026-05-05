package com.example.firstspringbootapp.dto;

import java.time.LocalDateTime;

import com.example.firstspringbootapp.model.BorrowingStatus;

public record BorrowingResponse(
	Long id,
	Long userId,
	String username,
	BookSummaryResponse book,
	LocalDateTime borrowDate,
	LocalDateTime dueDate,
	LocalDateTime returnDate,
	BorrowingStatus status,
	LocalDateTime createdAt
) {
}
