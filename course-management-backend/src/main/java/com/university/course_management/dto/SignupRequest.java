package com.university.course_management.dto;

import com.university.course_management.model.Role;
import jakarta.validation.constraints.*;

public record SignupRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        @NotBlank String password,
        @NotNull Role role
) {}

