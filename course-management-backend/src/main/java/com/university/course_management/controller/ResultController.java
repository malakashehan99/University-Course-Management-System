package com.university.course_management.controller;

import com.university.course_management.dto.ResultRequest;
import com.university.course_management.model.Result;
import com.university.course_management.service.ResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
@CrossOrigin
public class ResultController {

    private final ResultService resultService;

    @PostMapping
    public ResponseEntity<Result> upload(@RequestBody @Valid ResultRequest req) {
        return ResponseEntity.ok(resultService.upload(req));
    }

    @PatchMapping("/{resultId}")
    public ResponseEntity<Result> update(@PathVariable Long resultId,
                                         @RequestParam(required = false) Double marks,
                                         @RequestParam(required = false) String grade) {
        return ResponseEntity.ok(resultService.update(resultId, marks, grade));
    }

    @GetMapping("/by-student/{studentId}")
    public ResponseEntity<List<Result>> byStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.byStudent(studentId));
    }

    @GetMapping("/by-course/{courseId}")
    public ResponseEntity<List<Result>> byCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(resultService.byCourse(courseId));
    }
}
