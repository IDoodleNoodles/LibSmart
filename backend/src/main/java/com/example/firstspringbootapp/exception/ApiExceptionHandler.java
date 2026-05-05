package com.example.firstspringbootapp.exception;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<ApiErrorResponse> handleResponseStatusException(ResponseStatusException exception, HttpServletRequest request) {
		return buildErrorResponse(exception.getStatusCode().value(), exception.getReason(), request.getRequestURI());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiErrorResponse> handleValidationException(MethodArgumentNotValidException exception, HttpServletRequest request) {
		List<String> errors = exception.getBindingResult().getFieldErrors().stream()
			.map(this::formatFieldError)
			.toList();
		String message = errors.isEmpty() ? "Validation failed" : String.join(", ", errors);
		return buildErrorResponse(HttpStatus.BAD_REQUEST.value(), message, request.getRequestURI());
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiErrorResponse> handleConstraintViolationException(ConstraintViolationException exception, HttpServletRequest request) {
		String message = exception.getConstraintViolations().stream()
			.map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
			.collect(Collectors.joining(", "));
		if (message.isBlank()) {
			message = "Validation failed";
		}
		return buildErrorResponse(HttpStatus.BAD_REQUEST.value(), message, request.getRequestURI());
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<ApiErrorResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException exception, HttpServletRequest request) {
		return buildErrorResponse(HttpStatus.METHOD_NOT_ALLOWED.value(), exception.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<ApiErrorResponse> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException exception, HttpServletRequest request) {
		return buildErrorResponse(HttpStatus.PAYLOAD_TOO_LARGE.value(), "Image is too large. Max upload size is 25MB.", request.getRequestURI());
	}

	@ExceptionHandler(MultipartException.class)
	public ResponseEntity<ApiErrorResponse> handleMultipartException(MultipartException exception, HttpServletRequest request) {
		return buildErrorResponse(HttpStatus.BAD_REQUEST.value(), "Invalid multipart upload payload.", request.getRequestURI());
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiErrorResponse> handleGenericException(Exception exception, HttpServletRequest request) {
		return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "An unexpected error occurred", request.getRequestURI());
	}

	private ResponseEntity<ApiErrorResponse> buildErrorResponse(int status, String message, String path) {
		HttpStatus httpStatus = HttpStatus.valueOf(status);
		return ResponseEntity.status(httpStatus).body(new ApiErrorResponse(
			Instant.now().toString(),
			status,
			httpStatus.getReasonPhrase(),
			message == null || message.isBlank() ? httpStatus.getReasonPhrase() : message,
			path
		));
	}

	private String formatFieldError(FieldError fieldError) {
		if (fieldError == null) {
			return "Invalid value";
		}
		String field = fieldError.getField() == null ? "field" : fieldError.getField();
		String message = fieldError.getDefaultMessage() == null ? "is invalid" : fieldError.getDefaultMessage();
		return field + " " + message;
	}

	public static record ApiErrorResponse(
		String timestamp,
		int status,
		String error,
		String message,
		String path
	) {
	}
}