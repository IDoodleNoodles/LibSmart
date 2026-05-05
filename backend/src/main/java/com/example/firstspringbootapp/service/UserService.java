package com.example.firstspringbootapp.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.concurrent.TimeUnit;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.firstspringbootapp.dto.ApiMessageResponse;
import com.example.firstspringbootapp.dto.AdminUserCreateRequest;
import com.example.firstspringbootapp.dto.AuthLoginRequest;
import com.example.firstspringbootapp.dto.AuthResponse;
import com.example.firstspringbootapp.dto.ChangePasswordRequest;
import com.example.firstspringbootapp.dto.MembershipInfoResponse;
import com.example.firstspringbootapp.dto.PhotoUploadResponse;
import com.example.firstspringbootapp.dto.RegisterRequest;
import com.example.firstspringbootapp.dto.RoleUpdateRequest;
import com.example.firstspringbootapp.dto.UpdateProfileRequest;
import com.example.firstspringbootapp.dto.UserProfileResponse;
import com.example.firstspringbootapp.dto.UserWithMessageResponse;
import com.example.firstspringbootapp.model.MembershipIdRequestStatus;
import com.example.firstspringbootapp.model.Role;
import com.example.firstspringbootapp.model.User;
import com.example.firstspringbootapp.repository.UserRepository;
import com.example.firstspringbootapp.security.JwtUtil;

@Service
@Transactional
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtil = jwtUtil;
	}

	public AuthResponse login(AuthLoginRequest request) {
		User user = userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase(request.identifier(), request.identifier())
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

		if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
		}

		String token = jwtUtil.generateToken(user);
		return new AuthResponse(true, "Login successful", token, user.getRole(), toProfileResponse(user));
	}

	public ApiMessageResponse register(RegisterRequest request) {
		String username = normalize(request.username());
		String email = normalize(request.email());

		if (userRepository.existsByUsernameIgnoreCase(username)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
		}
		if (userRepository.existsByEmailIgnoreCase(email)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
		}

		User user = new User();
		user.setUsername(username);
		user.setEmail(email);
		user.setFullName(request.fullName().trim());
		user.setPhone(normalize(request.phone()));
		user.setAddress(normalize(request.address()));
		user.setPasswordHash(passwordEncoder.encode(request.password()));
		user.setRole(Role.USER);
		userRepository.save(user);

		return new ApiMessageResponse("Registration successful. User created with default USER role.");
	}

	public UserProfileResponse createUser(AdminUserCreateRequest request) {
		String username = normalize(request.username());
		String email = normalize(request.email());

		if (userRepository.existsByUsernameIgnoreCase(username)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
		}
		if (userRepository.existsByEmailIgnoreCase(email)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
		}

		User user = new User();
		user.setUsername(username);
		user.setEmail(email);
		user.setFullName(request.fullName().trim());
		user.setPhone(normalize(request.phone()));
		user.setAddress(normalize(request.address()));
		user.setPasswordHash(passwordEncoder.encode(request.password()));
		user.setRole(request.role() == null ? Role.USER : request.role());

		return toProfileResponse(userRepository.save(user));
	}

	@Transactional(readOnly = true)
	public UserProfileResponse getProfile(Long userId) {
		return userRepository.findProfileById(userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
	}

	public MembershipInfoResponse getMembershipInfo(Long userId) {
		User user = getUserOrThrow(userId);

		MembershipIdRequestStatus currentStatus = user.getMembershipIdRequestStatus();
		if (currentStatus == null) {
			currentStatus = MembershipIdRequestStatus.NONE;
		}
		MembershipIdRequestStatus nextStatus = currentStatus == MembershipIdRequestStatus.NONE
			? MembershipIdRequestStatus.ISSUED
			: MembershipIdRequestStatus.REREQUESTED;

		user.setMembershipIdRequestStatus(nextStatus);
		userRepository.save(user);

		return new MembershipInfoResponse(buildMembershipId(user), user.getCreatedAt(), nextStatus);
	}

	public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
		User user = getUserOrThrow(userId);
		String newUsername = normalize(request.username());
		String newEmail = normalize(request.email());

		userRepository.findByUsernameIgnoreCase(newUsername)
			.filter(existing -> !existing.getId().equals(userId))
			.ifPresent(existing -> {
				throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
			});
		userRepository.findByEmailIgnoreCase(newEmail)
			.filter(existing -> !existing.getId().equals(userId))
			.ifPresent(existing -> {
				throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
			});

		user.setUsername(newUsername);
		user.setEmail(newEmail);
		user.setFullName(request.fullName().trim());
		user.setPhone(normalize(request.phone()));
		user.setAddress(normalize(request.address()));
		return toProfileResponse(userRepository.save(user));
	}

	public ApiMessageResponse changePassword(Long userId, ChangePasswordRequest request) {
		long start = System.nanoTime();
		User user = getUserOrThrow(userId);
		try {
			if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
				logger.info("Password change failed for user {}: incorrect current password", userId);
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
			}

			user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
			userRepository.save(user);
			long took = (System.nanoTime() - start) / 1_000_000;
			logger.info("Password changed for user {} in {} ms", userId, took);
			return new ApiMessageResponse("Password updated successfully");
		} catch (ResponseStatusException ex) {
			throw ex;
		} catch (Exception ex) {
			logger.error("Unexpected error while changing password for user {}", userId, ex);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to change password", ex);
		}
	}

	public PhotoUploadResponse uploadProfilePhoto(Long userId, MultipartFile file) {
		User user = getUserOrThrow(userId);
		validateImage(file);

		try {
			byte[] processed = resizeImageIfNeeded(file, 800);
			user.setProfilePhoto(processed);
			userRepository.save(user);
			return new PhotoUploadResponse("Profile photo uploaded successfully", buildPhotoReference(userId, file.getOriginalFilename()));
		} catch (DataAccessException ex) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save profile photo. Please retry.", ex);
		} catch (IOException ex) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not read uploaded file", ex);
		}
	}

	@Transactional(readOnly = true)
	public ResponseEntity<byte[]> getProfilePhoto(Long userId) {
		User user = getUserOrThrow(userId);
		if (user.getProfilePhoto() == null || user.getProfilePhoto().length == 0) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile photo not found");
		}

		MediaType mediaType = detectImageMediaType(user.getProfilePhoto());

		String etag = generateETag(user.getProfilePhoto());

		return ResponseEntity.ok()
			.cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic())
			.eTag(etag)
			.contentType(mediaType)
			.body(user.getProfilePhoto());
	}

	@Transactional(readOnly = true)
	public List<UserProfileResponse> getAllUsers() {
		return userRepository.findAllProfiles();
	}

	public UserWithMessageResponse updateUserRole(Long userId, RoleUpdateRequest request) {
		User user = getUserOrThrow(userId);
		user.setRole(request.role());
		User savedUser = userRepository.save(user);
		return new UserWithMessageResponse("Role updated successfully", toProfileResponse(savedUser));
	}

	public ApiMessageResponse deleteUser(Long userId) {
		User user = getUserOrThrow(userId);
		userRepository.delete(user);
		return new ApiMessageResponse("User deleted successfully");
	}

	@Transactional(readOnly = true)
	public User getUserEntity(Long userId) {
		return getUserOrThrow(userId);
	}

	private User getUserOrThrow(Long userId) {
		return userRepository.findById(userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
	}

	private UserProfileResponse toProfileResponse(User user) {
		return new UserProfileResponse(
			user.getId(),
			user.getUsername(),
			user.getEmail(),
			user.getFullName(),
			user.getPhone(),
			user.getAddress(),
			user.getRole(),
			user.getCreatedAt(),
			user.getProfilePhoto() != null && user.getProfilePhoto().length > 0
		);
	}

	private String buildMembershipId(User user) {
		LocalDateTime createdAt = user.getCreatedAt();
		int year = createdAt != null ? createdAt.getYear() : LocalDateTime.now().getYear();
		return String.format("LIB-%d-%06d", year, user.getId());
	}

	private void validateImage(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file is required");
		}

		String contentType = file.getContentType();
		if (contentType == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only JPG and PNG images are allowed");
		}

		String normalized = contentType.toLowerCase(Locale.ROOT);
		if (!normalized.equals("image/jpeg") && !normalized.equals("image/jpg") && !normalized.equals("image/png")) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only JPG and PNG images are allowed");
		}
	}

	private String buildPhotoReference(Long userId, String originalFilename) {
		String safeName = originalFilename == null ? "profile-photo" : originalFilename.replaceAll("[^a-zA-Z0-9.\\-]", "_");
		return "user-" + userId + "-" + safeName;
	}

	private byte[] resizeImageIfNeeded(MultipartFile file, int maxDim) throws IOException {
		try (var in = file.getInputStream()) {
			BufferedImage img = javax.imageio.ImageIO.read(in);
			if (img == null) {
				return file.getBytes();
			}

			int w = img.getWidth();
			int h = img.getHeight();
			if (w <= maxDim && h <= maxDim) {
				return file.getBytes();
			}

			double scale = Math.min((double) maxDim / w, (double) maxDim / h);
			int nw = Math.max(1, (int) Math.round(w * scale));
			int nh = Math.max(1, (int) Math.round(h * scale));

			BufferedImage resized = new BufferedImage(nw, nh, BufferedImage.TYPE_INT_RGB);
			Graphics2D g = resized.createGraphics();
			g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
			g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
			g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			g.drawImage(img, 0, 0, nw, nh, null);
			g.dispose();

			String contentType = file.getContentType();
			String format = (contentType != null && contentType.toLowerCase(Locale.ROOT).contains("png")) ? "png" : "jpg";

			try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
				javax.imageio.ImageIO.write(resized, format, baos);
				return baos.toByteArray();
			}
		}
	}

	private String generateETag(byte[] bytes) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			byte[] digest = md.digest(bytes);
			return "\"" + HexFormat.of().formatHex(digest) + "\"";
		} catch (Exception e) {
			return "\"0\"";
		}
	}

	private MediaType detectImageMediaType(byte[] photo) {
		if (photo == null || photo.length < 4) {
			return MediaType.APPLICATION_OCTET_STREAM;
		}

		if (photo[0] == (byte) 0x89 && photo[1] == 0x50 && photo[2] == 0x4E && photo[3] == 0x47) {
			return MediaType.IMAGE_PNG;
		}

		if (photo[0] == (byte) 0xFF && photo[1] == (byte) 0xD8) {
			return MediaType.IMAGE_JPEG;
		}

		return MediaType.APPLICATION_OCTET_STREAM;
	}

	private String normalize(String value) {
		return value == null ? null : value.trim();
	}
}