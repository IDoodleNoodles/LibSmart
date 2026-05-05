package com.example.firstspringbootapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.firstspringbootapp.dto.ApiResponse;
import com.example.firstspringbootapp.dto.BookResponse;
import com.example.firstspringbootapp.dto.BookUpsertRequest;
import com.example.firstspringbootapp.model.BookStatus;
import com.example.firstspringbootapp.service.BookService;

import jakarta.validation.Valid;

@RestController
@Validated
public class BookController {

	private final BookService bookService;

	public BookController(BookService bookService) {
		this.bookService = bookService;
	}

	@PostMapping("/api/admin/books")
	public ResponseEntity<ApiResponse<BookResponse>> createBook(@Valid @RequestBody BookUpsertRequest request) {
		BookResponse data = bookService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Book created successfully", data));
	}

	@GetMapping("/api/books")
	public ResponseEntity<ApiResponse<List<BookResponse>>> getBooks(
		@RequestParam(name = "category", required = false) Long categoryId,
		@RequestParam(name = "branch", required = false) Long branchId,
		@RequestParam(name = "status", required = false) BookStatus status,
		@RequestParam(name = "search", required = false) String search
	) {
		List<BookResponse> data = bookService.getAll(categoryId, branchId, status, search);
		return ResponseEntity.ok(ApiResponse.success("Books fetched successfully", data));
	}

	@GetMapping("/api/books/{id}")
	public ResponseEntity<ApiResponse<BookResponse>> getBookById(@PathVariable Long id) {
		return ResponseEntity.ok(ApiResponse.success("Book fetched successfully", bookService.getById(id)));
	}

	@PutMapping("/api/admin/books/{id}")
	public ResponseEntity<ApiResponse<BookResponse>> updateBook(@PathVariable Long id, @Valid @RequestBody BookUpsertRequest request) {
		return ResponseEntity.ok(ApiResponse.success("Book updated successfully", bookService.update(id, request)));
	}

	@DeleteMapping("/api/admin/books/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
		bookService.delete(id);
		return ResponseEntity.ok(ApiResponse.successMessage("Book deleted successfully"));
	}

	@PostMapping(value = "/api/admin/books/{id}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ApiResponse<Void>> uploadCover(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
		bookService.uploadCover(id, file);
		return ResponseEntity.ok(ApiResponse.successMessage("Book cover uploaded successfully"));
	}

	@GetMapping("/api/books/{id}/cover")
	public ResponseEntity<byte[]> getCover(@PathVariable Long id) {
		return bookService.getCover(id);
	}
}
