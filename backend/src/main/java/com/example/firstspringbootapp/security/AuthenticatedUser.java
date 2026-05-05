package com.example.firstspringbootapp.security;

import com.example.firstspringbootapp.model.Role;

public record AuthenticatedUser(Long userId, String username, Role role) {
}