package com.university.course_management.repository;

import com.university.course_management.model.Course;
import com.university.course_management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    boolean existsByCode(String code);

    //  used for safe delete of faculty
    long countByFaculty(User faculty);

    // for “assigned courses” endpoint:
    List<Course> findAllByFaculty_UserId(Long facultyId);
}
