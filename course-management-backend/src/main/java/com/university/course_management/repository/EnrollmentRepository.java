package com.university.course_management.repository;

import com.university.course_management.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent(User student);
    List<Enrollment> findByCourse(Course course);
    Optional<Enrollment> findByStudentAndCourse(User student, Course course);


    long countByCourseAndStatus(Course course, Status status);

    //for safe student delete
    long countByStudent(User student);
}
