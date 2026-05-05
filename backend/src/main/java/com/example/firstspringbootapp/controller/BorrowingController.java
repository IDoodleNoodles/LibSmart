package com.example.firstspringbootapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.firstspringbootapp.dto.ApiResponse;
import com.example.firstspringbootapp.dto.BorrowingResponse;
import com.example.firstspringbootapp.model.Role;
import com.example.firstspringbootapp.security.AuthenticatedUser;
import com.example.firstspringbootapp.service.BorrowingService;

@RestController
@Validated
public class BorrowingController {

	private final BorrowingService borrowingService;

	public BorrowingController(BorrowingService borrowingService) {
		this.borrowingService = borrowingService;
	}

	@PostMapping("/api/user/borrow/{bookId}")
	public ResponseEntity<ApiResponse<BorrowingResponse>> borrowBook(
		@AuthenticationPrincipal AuthenticatedUser currentUser,
		@PathVariable Long bookId
	) {
		BorrowingResponse data = borrowingService.borrowBook(currentUser.userId(), bookId);
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Book borrowed successfully", data));
	}

	@PostMapping("/api/user/return/{borrowingId}")
	public ResponseEntity<ApiResponse<Void>> returnBook(
		@AuthenticationPrincipal AuthenticatedUser currentUser,
		@PathVariable Long borrowingId
	) {
		boolean isAdmin = currentUser.role() == Role.ADMIN;
		borrowingService.returnBook(currentUser.userId(), isAdmin, borrowingId);
		return ResponseEntity.ok(ApiResponse.successMessage("Book returned successfully"));
	}

	@GetMapping("/api/user/my-books")
	public ResponseEntity<ApiResponse<List<BorrowingResponse>>> getMyBooks(
		@AuthenticationPrincipal AuthenticatedUser currentUser
	) {
		List<BorrowingResponse> data = borrowingService.getMyBorrowings(currentUser.userId());
		return ResponseEntity.ok(ApiResponse.success("Borrowings fetched successfully", data));
	}

	@GetMapping("/api/admin/borrowings")
	public ResponseEntity<ApiResponse<List<BorrowingResponse>>> getAllBorrowings() {
		return ResponseEntity.ok(ApiResponse.success("Borrowings fetched successfully", borrowingService.getAllBorrowings()));
	}
}
