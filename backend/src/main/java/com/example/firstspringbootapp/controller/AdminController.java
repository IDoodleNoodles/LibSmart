package com.example.firstspringbootapp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.firstspringbootapp.dto.RoleUpdateRequest;
import com.example.firstspringbootapp.dto.UserProfileResponse;
import com.example.firstspringbootapp.dto.UserWithMessageResponse;
import com.example.firstspringbootapp.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@Validated
public class AdminController {

	private final UserService userService;

	public AdminController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/users")
	public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
		return ResponseEntity.ok(userService.getAllUsers());
	}

	@PutMapping("/users/{id}/role")
	public ResponseEntity<UserWithMessageResponse> updateRole(@PathVariable Long id, @Valid @RequestBody RoleUpdateRequest request) {
		return ResponseEntity.ok(userService.updateUserRole(id, request));
	}
}