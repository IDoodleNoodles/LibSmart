package com.example.firstspringbootapp.dto;

public record UserWithMessageResponse(String message, UserProfileResponse user) {
}