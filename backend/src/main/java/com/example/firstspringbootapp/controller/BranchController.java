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
import com.example.firstspringbootapp.dto.BranchRequest;
import com.example.firstspringbootapp.dto.BranchResponse;
import com.example.firstspringbootapp.service.BranchService;

import jakarta.validation.Valid;

@RestController
@Validated
public class BranchController {

	private final BranchService branchService;

	public BranchController(BranchService branchService) {
		this.branchService = branchService;
	}

	@PostMapping("/api/admin/branches")
	public ResponseEntity<ApiResponse<BranchResponse>> create(@Valid @RequestBody BranchRequest request) {
		BranchResponse data = branchService.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Branch created successfully", data));
	}

	@GetMapping("/api/branches")
	public ResponseEntity<ApiResponse<List<BranchResponse>>> getAll() {
		return ResponseEntity.ok(ApiResponse.success("Branches fetched successfully", branchService.getAll()));
	}

	@PutMapping("/api/admin/branches/{id}")
	public ResponseEntity<ApiResponse<BranchResponse>> update(@PathVariable Long id, @Valid @RequestBody BranchRequest request) {
		return ResponseEntity.ok(ApiResponse.success("Branch updated successfully", branchService.update(id, request)));
	}

	@DeleteMapping("/api/admin/branches/{id}")
	public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
		branchService.delete(id);
		return ResponseEntity.ok(ApiResponse.successMessage("Branch deleted successfully"));
	}
}
