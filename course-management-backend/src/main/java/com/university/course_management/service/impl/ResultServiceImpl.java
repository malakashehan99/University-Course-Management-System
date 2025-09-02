package com.university.course_management.service.impl;

import com.university.course_management.dto.ResultRequest;
import com.university.course_management.exception.BadRequestException;
import com.university.course_management.exception.ResourceNotFoundException;
import com.university.course_management.model.*;
import com.university.course_management.repository.*;
import com.university.course_management.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service @RequiredArgsConstructor @Transactional
public class ResultServiceImpl implements ResultService {

    private final ResultRepository resultRepo;
    private final UserRepository userRepo;
    private final CourseRepository courseRepo;
    private final EnrollmentRepository enrollmentRepo;

    @Override
    public Result upload(ResultRequest req) {
        User student = userRepo.findById(req.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Course course = courseRepo.findById(req.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // optional: ensure student enrolled (and not dropped)
        enrollmentRepo.findByStudentAndCourse(student, course)
                .orElseThrow(() -> new BadRequestException("Student is not enrolled in this course"));

        if (resultRepo.findByStudentAndCourse(student, course).isPresent())
            throw new BadRequestException("Result already exists for this student & course");

        Result r = Result.builder()
                .student(student)
                .course(course)
                .marks(req.marks())
                .grade(req.grade())
                .build();

        return resultRepo.save(r);
    }

    @Override
    public Result update(Long resultId, Double marks, String grade) {
        Result existing = resultRepo.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found"));
        if (marks != null) existing.setMarks(marks);
        if (grade != null) existing.setGrade(grade);
        return resultRepo.save(existing);
    }

    @Override @Transactional(readOnly = true)
    public List<Result> byStudent(Long studentId) {
        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return resultRepo.findByStudent(student);
    }

    @Override @Transactional(readOnly = true)
    public List<Result> byCourse(Long courseId) {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        return resultRepo.findByCourse(course);
    }
}

