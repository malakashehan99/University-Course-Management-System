package com.university.course_management.dto;

import com.university.course_management.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserUpdateRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        @NotNull Role role
) {}
