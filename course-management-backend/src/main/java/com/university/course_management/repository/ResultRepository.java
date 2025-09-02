package com.university.course_management.repository;

import com.university.course_management.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudent(User student);
    List<Result> findByCourse(Course course);
    Optional<Result> findByStudentAndCourse(User student, Course course);

    // for safe student delete
    long countByStudent(User student);
}
