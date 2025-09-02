package com.university.course_management.controller;

import com.university.course_management.dto.CourseRequest;
import com.university.course_management.model.Course;
import com.university.course_management.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@CrossOrigin
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<Course> create(@RequestBody @Valid CourseRequest req) {
        return ResponseEntity.ok(courseService.create(req));
    }

    @GetMapping
    public ResponseEntity<List<Course>> all() {
        return ResponseEntity.ok(courseService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> byId(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id,
                                         @RequestBody @Valid CourseRequest req) {
        return ResponseEntity.ok(courseService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{courseId}/assign/{facultyId}")
    public ResponseEntity<Course> assignFaculty(@PathVariable Long courseId,
                                                @PathVariable Long facultyId) {
        return ResponseEntity.ok(courseService.assignFaculty(courseId, facultyId));
    }
}
