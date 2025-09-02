package com.university.course_management.service.impl;

import com.university.course_management.dto.EnrollmentRequest;
import com.university.course_management.exception.BadRequestException;
import com.university.course_management.exception.ResourceNotFoundException;
import com.university.course_management.model.*;
import com.university.course_management.repository.CourseRepository;
import com.university.course_management.repository.EnrollmentRepository;
import com.university.course_management.repository.UserRepository;
import com.university.course_management.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

import java.util.List;

@Service @RequiredArgsConstructor @Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepo;
    private final CourseRepository courseRepo;
    private final UserRepository userRepo;

    @Override
    public Enrollment enroll(EnrollmentRequest req) {
        User student = userRepo.findById(req.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        if (student.getRole() != Role.STUDENT)
            throw new BadRequestException("User is not a student");

        Course course = courseRepo.findById(req.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        //  capacity: count only ENROLLED (active) rows
        long current = enrollmentRepo.countByCourseAndStatus(course, Status.ENROLLED);
        if (current >= course.getCapacity())
            throw new BadRequestException("Course is full");

        if (enrollmentRepo.findByStudentAndCourse(student, course).isPresent())
            throw new BadRequestException("Already enrolled in this course");

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .status(Status.ENROLLED)
                .enrollDate(LocalDateTime.now())
                .build();

        return enrollmentRepo.save(enrollment);
    }

    @Override
    public Enrollment drop(Long studentId, Long courseId) {
        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Enrollment en = enrollmentRepo.findByStudentAndCourse(student, course)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));
        en.setStatus(Status.DROPPED);
        return enrollmentRepo.save(en);
    }

    @Override @Transactional(readOnly = true)
    public List<Enrollment> byStudent(Long studentId) {
        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return enrollmentRepo.findByStudent(student);
    }

    @Override @Transactional(readOnly = true)
    public List<Enrollment> byCourse(Long courseId) {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        return enrollmentRepo.findByCourse(course);
    }
}
