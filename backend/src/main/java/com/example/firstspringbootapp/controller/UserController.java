package com.example.firstspringbootapp.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.firstspringbootapp.dto.ApiMessageResponse;
import com.example.firstspringbootapp.dto.ChangePasswordRequest;
import com.example.firstspringbootapp.dto.MembershipInfoResponse;
import com.example.firstspringbootapp.dto.PhotoUploadResponse;
import com.example.firstspringbootapp.dto.UpdateProfileRequest;
import com.example.firstspringbootapp.dto.UserProfileResponse;
import com.example.firstspringbootapp.security.AuthenticatedUser;
import com.example.firstspringbootapp.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@Validated
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/profile")
	public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal AuthenticatedUser currentUser) {
		return ResponseEntity.ok(userService.getProfile(currentUser.userId()));
	}

	@GetMapping("/membership")
	public ResponseEntity<MembershipInfoResponse> getMembershipInfo(@AuthenticationPrincipal AuthenticatedUser currentUser) {
		return ResponseEntity.ok(userService.getMembershipInfo(currentUser.userId()));
	}

	@GetMapping(value = "/photo")
	public ResponseEntity<byte[]> getPhoto(@AuthenticationPrincipal AuthenticatedUser currentUser) {
		return userService.getProfilePhoto(currentUser.userId());
	}

	@PutMapping("/profile/edit")
	public ResponseEntity<UserProfileResponse> editProfile(
		@AuthenticationPrincipal AuthenticatedUser currentUser,
		@Valid @RequestBody UpdateProfileRequest request
	) {
		return ResponseEntity.ok(userService.updateProfile(currentUser.userId(), request));
	}

	@PutMapping("/password/edit")
	public ResponseEntity<ApiMessageResponse> editPassword(
		@AuthenticationPrincipal AuthenticatedUser currentUser,
		@Valid @RequestBody ChangePasswordRequest request
	) {
		return ResponseEntity.ok(userService.changePassword(currentUser.userId(), request));
	}

	@PostMapping(value = "/photo/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<PhotoUploadResponse> uploadPhoto(
		@AuthenticationPrincipal AuthenticatedUser currentUser,
		@RequestParam("file") MultipartFile file
	) {
		return ResponseEntity.ok(userService.uploadProfilePhoto(currentUser.userId(), file));
	}
}