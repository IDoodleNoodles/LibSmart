package com.example.firstspringbootapp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.firstspringbootapp.dto.ApiMessageResponse;
import com.example.firstspringbootapp.dto.AuthLoginRequest;
import com.example.firstspringbootapp.dto.AuthResponse;
import com.example.firstspringbootapp.dto.RegisterRequest;
import com.example.firstspringbootapp.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

	private final UserService userService;

	public AuthController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthLoginRequest request) {
		return ResponseEntity.ok(userService.login(request));
	}

	@PostMapping("/register")
	public ResponseEntity<ApiMessageResponse> register(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(request));
	}
}