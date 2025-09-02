package com.university.course_management.service;

import com.university.course_management.dto.EnrollmentRequest;
import com.university.course_management.model.Enrollment;

import java.util.List;

public interface EnrollmentService {
    Enrollment enroll(EnrollmentRequest req);
    Enrollment drop(Long studentId, Long courseId);
    List<Enrollment> byStudent(Long studentId);
    List<Enrollment> byCourse(Long courseId);
}
