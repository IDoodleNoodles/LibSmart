package com.example.firstspringbootapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.firstspringbootapp.dto.ApiResponse;
import com.example.firstspringbootapp.dto.CategoryRequest;
import com.example.firstspringbootapp.dto.CategoryResponse;
import com.example.firstspringbootapp.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@Validated
public class CategoryController {

	private final CategoryService categoryService;

	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}

	@PostMapping("/api/admin/categories")
	public ResponseEntity<ApiResponse<CategoryResponse>> create(@Valid @RequestBody CategoryRequest request) {
		CategoryResponse data = categoryService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Category created successfully", data));
	}

	@GetMapping("/api/categories")
	public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAll() {
		return ResponseEntity.ok(ApiResponse.success("Categories fetched successfully", categoryService.getAll()));
	}

	@PutMapping("/api/admin/categories/{id}")
	public ResponseEntity<ApiResponse<CategoryResponse>> update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
		return ResponseEntity.ok(ApiResponse.success("Category updated successfully", categoryService.update(id, request)));
	}

	@DeleteMapping("/api/admin/categories/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
		categoryService.delete(id);
		return ResponseEntity.ok(ApiResponse.successMessage("Category deleted successfully"));
	}
}
