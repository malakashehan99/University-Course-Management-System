package com.university.course_management.dto;

import jakarta.validation.constraints.*;

public record CourseRequest(
        @NotBlank String title,
        @NotBlank @Size(max = 20) String code,
        @Min(1) int capacity,
        Long facultyId // nullable
) {}

