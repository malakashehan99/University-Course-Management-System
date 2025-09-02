package com.university.course_management.controller;

import com.university.course_management.dto.EnrollmentRequest;
import com.university.course_management.model.Enrollment;
import com.university.course_management.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@CrossOrigin
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<Enrollment> enroll(@RequestBody @Valid EnrollmentRequest req) {
        return ResponseEntity.ok(enrollmentService.enroll(req));
    }

    @PostMapping("/drop")
    public ResponseEntity<Enrollment> drop(@RequestParam Long studentId,
                                           @RequestParam Long courseId) {
        return ResponseEntity.ok(enrollmentService.drop(studentId, courseId));
    }

    @GetMapping("/by-student/{studentId}")
    public ResponseEntity<List<Enrollment>> byStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(enrollmentService.byStudent(studentId));
    }

    @GetMapping("/by-course/{courseId}")
    public ResponseEntity<List<Enrollment>> byCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.byCourse(courseId));
    }
}
