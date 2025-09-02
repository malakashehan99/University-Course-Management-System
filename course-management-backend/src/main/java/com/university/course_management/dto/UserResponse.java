package com.university.course_management.dto;

import com.university.course_management.model.Role;

public record UserResponse(Long id, String fullName, String email, Role role) {}
