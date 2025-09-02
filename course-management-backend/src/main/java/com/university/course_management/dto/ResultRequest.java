package com.university.course_management.dto;

import jakarta.validation.constraints.*;

public record ResultRequest(
        @NotNull Long studentId,
        @NotNull Long courseId,
        @NotNull @DecimalMin("0") Double marks,
        String grade
) {}

